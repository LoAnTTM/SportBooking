import { create } from 'zustand';

import { GEOGRAPHY_RADIUS } from '@/constants';
import { calculateDistance } from '@/helpers/location';
import { mappingUnitModelToUnitCard } from '@/helpers/mapping';
import { round } from '@/helpers/number';
import { compare, deepClone } from '@/helpers/object';
import { stringQueryToSearchUnitQuery } from '@/helpers/pagination';
import {
  FilterOptions, GetBookedTimeRequest, PopularUnitRequest, SearchUnitQuery, TimeRange, UnitCard
} from '@/services/types';
import unitService from '@/services/unit.service';
import { GeographyModel, UnitModel, UnitPagination } from '@/types/model';

export enum UnitRenderTypes {
  POPULAR = 'popular',
  NEARBY = 'nearby',
  SEARCH = 'search',
}

interface UnitState {
  popularUnits: UnitCard[];
  nearByUnits: UnitCard[];
  searchUnits: UnitCard[];
  currentUnit: UnitCard;
  total: number;
  pagination: UnitPagination;
  filter: FilterOptions;
  bookedTimes: {
    [date: string]: TimeRange[];
  };
  isLoading: boolean;
  canLoadMore: boolean;
}

interface UnitActions {
  fetchPopularUnits: (query: PopularUnitRequest) => Promise<void>;
  fetchNearByUnits: (query: SearchUnitQuery) => Promise<void>;
  fetchDetailUnit: (id: string, location: GeographyModel) => Promise<void>;
  search: (query: SearchUnitQuery, location: GeographyModel) => Promise<void>;
  updateFilter: (filter: Partial<FilterOptions>) => void;
  loadMore: (location: GeographyModel) => Promise<void>;
  fetchBookedTime: (day: string) => Promise<void>;
  hasFilter: () => boolean;
  reset: () => void;
  resetSearch: () => void;
}

export const initFilter = {
  location: { province: '', district: '', ward: '' },
  sportType: '',
  isNearby: false,
  radius: GEOGRAPHY_RADIUS,
  orderBy: '',
  orderType: '',
} as FilterOptions;

const initialState: UnitState = {
  popularUnits: [],
  nearByUnits: [],
  currentUnit: {} as UnitCard,
  searchUnits: [],
  total: 0,
  pagination: {} as UnitPagination,
  filter: deepClone(initFilter),
  isLoading: false,
  canLoadMore: false,
  bookedTimes: {},
};

export const useUnitStore = create<UnitState & UnitActions>((set, get) => ({
  ...initialState,

  fetchPopularUnits: async (reqBody: PopularUnitRequest) => {
    set({ isLoading: true });
    const response = await unitService.getPopularUnits(reqBody);
    if (response instanceof Error) {
      set({ isLoading: false });
      throw response;
    }

    const units = response.data.units;
    const popularUnits = units.map((unit: UnitModel) => {
      const unitCard = mappingUnitModelToUnitCard(unit);

      const distance = round(
        calculateDistance(
          { latitude: reqBody.latitude, longitude: reqBody.longitude },
          unit.address?.locationGeography
        )
      );
      unitCard.distance = `${distance} km`;
      return unitCard;
    });

    set({ popularUnits, isLoading: false });
  },

  fetchNearByUnits: async (query: SearchUnitQuery) => {
    const { latitude, longitude } = query;
    if (!latitude || !longitude) {
      set({ nearByUnits: [] });
      return;
    }

    set({ isLoading: true });
    const response = await unitService.search(query);
    if (response instanceof Error) {
      set({ isLoading: false });
      throw response;
    }

    const units = response.data.units;
    const nearByUnits = units.map((unit: UnitModel) => {
      const unitCard = mappingUnitModelToUnitCard(unit);
      const distance = round(
        calculateDistance(
          { latitude, longitude },
          unit.address?.locationGeography
        )
      );
      unitCard.distance = `${distance} km`;
      return unitCard;
    });
    set({ nearByUnits, isLoading: false });
  },

  fetchDetailUnit: async (id: string, location: GeographyModel) => {
    set({ isLoading: true });
    const response = await unitService.getDetail(id);
    if (response instanceof Error) {
      set({ isLoading: false });
      throw response;
    }

    const unit = response.data;
    const unitCard = mappingUnitModelToUnitCard(unit);

    const distance = round(
      calculateDistance(
        { latitude: location.latitude, longitude: location.longitude },
        unit.address?.locationGeography
      )
    );
    unitCard.distance = `${distance} km`;
    set({ currentUnit: unitCard, isLoading: false });
  },

  search: async (query: SearchUnitQuery, location: GeographyModel) => {
    set({ isLoading: true });
    const response = await unitService.search(query);
    if (response instanceof Error) {
      set({ isLoading: false });
      throw response;
    }

    let latitude = 0,
      longitude = 0;
    if (query.latitude && query.longitude) {
      latitude = query.latitude;
      longitude = query.longitude;
    } else {
      latitude = location.latitude;
      longitude = location.longitude;
    }

    const units = response.data.units;
    const total = response.data.total;
    const pagination = response.data.pagination;

    const searchUnits = units.map((unit: UnitModel) => {
      const unitCard = mappingUnitModelToUnitCard(unit);

      const distance = round(
        calculateDistance(
          { latitude: latitude, longitude: longitude },
          unit.address?.locationGeography
        )
      );
      unitCard.distance = `${distance} km`;
      return unitCard;
    });

    set({
      searchUnits,
      total,
      pagination,
      isLoading: false,
      canLoadMore: !!pagination?.nextPage,
    });
  },

  loadMore: async (location: GeographyModel) => {
    const { pagination } = get();
    if (!pagination || !pagination.nextPage) {
      return;
    }

    // convert pagination.nextPage to query
    const query = stringQueryToSearchUnitQuery(pagination.nextPage);
    const response = await unitService.search(query);
    if (response instanceof Error) {
      throw response;
    }

    const units = response.data.units;
    const total = response.data.total;
    const paginationData = response.data.pagination;

    const searchUnits = units.map((unit: UnitModel) => {
      const unitCard = mappingUnitModelToUnitCard(unit);

      const distance = round(
        calculateDistance(
          { latitude: location.latitude, longitude: location.longitude },
          unit.address?.locationGeography
        )
      );
      unitCard.distance = `${distance} km`;
      return unitCard;
    });

    set({
      searchUnits: get().searchUnits.concat(searchUnits),
      canLoadMore: !!paginationData?.nextPage,
      total,
      pagination: paginationData,
    });
  },

  fetchBookedTime: async (day: string) => {
    const { currentUnit } = get();
    if (!currentUnit.id) {
      return;
    }

    try {
      const requestData = {
        bookedDay: day,
      } as GetBookedTimeRequest;

      set({ isLoading: true });
      const response = await unitService.bookedTime(
        currentUnit.id,
        requestData
      );
      if (response instanceof Error) {
        set({ isLoading: false });
        throw response;
      }
      const bookedTimes = response.data.bookedTimes;
      set({ bookedTimes: { [requestData.bookedDay]: bookedTimes } });
    } catch (error) {
      console.error('Error fetching booked time:', error);
      if (error instanceof Error) {
        throw error;
      }
    } finally {
      set({ isLoading: false });
    }
  },

  updateFilter: (filter: Partial<FilterOptions>) => {
    set({ filter: { ...get().filter, ...filter } });
  },

  hasFilter: () => {
    return !compare(get().filter, initFilter, ['query']);
  },

  reset: () => {
    set({ ...initialState });
  },

  resetSearch: () => {
    set({ searchUnits: [] });
  },
}));
