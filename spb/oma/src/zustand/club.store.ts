import { create } from 'zustand';

import clubService from '@/services/club.service';
import mediaService from '@/services/media.service';
import { ClubModel, ClubUpdateModel, MediaModel, UnitUpdateModel } from '@/types/model';
import { createSelectors } from '@/zustand/selectors';

interface ClubState {
  club: ClubModel;
  isLoading: boolean;
}

interface ClubAction {
  fetchClubByOwner: (ownerId: string) => Promise<void>;
  updateClub: (club: ClubUpdateModel, clubId: string) => Promise<void>;
  updateUnit: (unit: UnitUpdateModel, unitId: string) => Promise<void>;
  addUnit: (unit: UnitUpdateModel) => Promise<void>;
  addMediaToClub: (clubId: string, media: MediaModel) => Promise<string>;
  removeMediaFromClub: (mediaId: string) => Promise<void>;
  addMediaToUnit: (unitId: string, media: MediaModel) => Promise<string>;
  removeMediaFromUnit: (mediaId: string) => Promise<void>;
}

const initialState: ClubState = {
  club: {} as ClubModel,
  isLoading: false,
};

const useClubStoreBase = create<ClubState & ClubAction>((set) => ({
  ...initialState,

  fetchClubByOwner: async (ownerId: string) => {
    set({ isLoading: true });
    const response = await clubService.getClubByOwner(ownerId);
    if (response instanceof Error) throw response;

    set({ club: response.data, isLoading: false });
  },

  updateClub: async (club: ClubUpdateModel, clubId: string) => {
    const response = await clubService.updateClub(club, clubId);
    if (response instanceof Error) throw response;
  },

  updateUnit: async (unit: UnitUpdateModel, unitId: string) => {
    const response = await clubService.updateUnit(unit, unitId);
    if (response instanceof Error) throw response;
  },

  addUnit: async (unit: UnitUpdateModel) => {
    const response = await clubService.addUnit(unit);
    if (response instanceof Error) throw response;
  },

  addMediaToClub: async (
    clubId: string,
    media: MediaModel
  ): Promise<string> => {
    const response = await mediaService.addMediaToClub(clubId, media);
    if (response instanceof Error) throw response;

    return response?.data?.mediaId;
  },

  removeMediaFromClub: async (mediaId: string) => {
    const response = await mediaService.removeMediaFromClub(mediaId);
    if (response instanceof Error) throw response;
  },

  addMediaToUnit: async (
    unitId: string,
    media: MediaModel
  ): Promise<string> => {
    const response = await mediaService.addMediaToUnit(unitId, media);
    if (response instanceof Error) throw response;

    return response?.data?.mediaId;
  },

  removeMediaFromUnit: async (mediaId: string) => {
    const response = await mediaService.removeMediaFromUnit(mediaId);
    if (response instanceof Error) throw response;
  },
}));

export const useClubStore = createSelectors(useClubStoreBase);
