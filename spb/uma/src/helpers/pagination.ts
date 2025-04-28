import qs from 'query-string';

import { CARD_LIST_SIZE } from '@/constants';
import { FilterOptions, SearchUnitQuery } from '@/services/types';

// &i = page items
// &p = page
// &b = order by
// &t = order type
// &q = query
// &st = sport type
// &pv = province
// &wd = ward
// &dt = district
// &lng = longitude
// &lat = latitude
// &r = radius
export const PARAMS = {
  pageItems: 'i',
  page: 'p',
  orderBy: 'b',
  orderType: 't',
  query: 'q',
  sportType: 'st',
  province: 'pv',
  ward: 'wd',
  district: 'dt',
  longitude: 'lng',
  latitude: 'lat',
  radius: 'r',
};

export class SearchUnitQueryBuilder {
  private query: SearchUnitQuery = {
    page: null,
    pageItems: null,
    orderBy: null,
    orderType: null,
    query: null,
    sportType: null,
    province: null,
    ward: null,
    district: null,
    longitude: null,
    latitude: null,
    radius: null,
  };

  setPage(page: number): this {
    this.query.page = page;
    return this;
  }

  setPageItems(items: number): this {
    this.query.pageItems = items;
    return this;
  }

  setOrderBy(orderBy: string): this {
    if (orderBy !== '') {
      this.query.orderBy = orderBy;
    }
    return this;
  }

  setOrderType(orderType: string): this {
    if (orderType !== '') {
      this.query.orderType = orderType;
    }
    return this;
  }

  setQuery(text: string): this {
    if (text !== '') {
      this.query.query = text;
    }
    return this;
  }

  setSportType(type: string): this {
    if (type !== '') {
      this.query.sportType = type;
    }
    return this;
  }

  setProvince(province: string): this {
    if (province !== '') {
      this.query.province = province;
    }
    return this;
  }

  setWard(ward: string): this {
    if (ward !== '') {
      this.query.ward = ward;
    }
    return this;
  }

  setDistrict(district: string): this {
    if (district !== '') {
      this.query.district = district;
    }
    return this;
  }

  setLongitude(lng: number): this {
    this.query.longitude = lng;
    return this;
  }

  setLatitude(lat: number): this {
    this.query.latitude = lat;
    return this;
  }

  setRadius(radius: number): this {
    if (radius > 0) {
      this.query.radius = radius;
    } else {
      this.query.radius = null;
    }
    return this;
  }

  build(): SearchUnitQuery {
    return this.query;
  }
}

export const buildSearchUnitQueryFromFilter = (
  filter: FilterOptions,
  args?: { [key: string]: string | number } | undefined
): SearchUnitQuery => {
  const queryBuilder = new SearchUnitQueryBuilder();
  const query = queryBuilder
    .setPage(1)
    .setPageItems(CARD_LIST_SIZE)
    .setOrderBy(filter.orderBy)
    .setOrderType(filter.orderType)
    .setSportType(filter.sportType)
    .setProvince(filter.location.province)
    .setDistrict(filter.location.district)
    .setWard(filter.location.ward)
    .setRadius(filter.isNearby ? filter.radius : 0)
    .setQuery(filter.query || '');

  if (!args) return query.build();

  if ('longitude' in args) {
    query.setLongitude(args.longitude as number);
  }
  if ('latitude' in args) {
    query.setLatitude(args.latitude as number);
  }
  return query.build();
};

export const getNumberParam = (
  params: qs.ParsedQuery<string>,
  key: string
): number | null => {
  if (key in params) {
    return Number(params[key]);
  }
  return null;
};

export const getStringParam = (
  params: qs.ParsedQuery<string>,
  key: string
): string | null => {
  if (key in params) {
    return params[key] as string;
  }
  return null;
};

export const stringQueryToSearchUnitQuery = (
  queryString: string
): SearchUnitQuery => {
  const params = qs.parse(queryString);
  const query: SearchUnitQuery = {
    page: getNumberParam(params, PARAMS.page),
    pageItems: getNumberParam(params, PARAMS.pageItems),
    orderBy: getStringParam(params, PARAMS.orderBy),
    orderType: getStringParam(params, PARAMS.orderType),
    query: getStringParam(params, PARAMS.query),
    sportType: getStringParam(params, PARAMS.sportType),
    province: getStringParam(params, PARAMS.province),
    ward: getStringParam(params, PARAMS.ward),
    district: getStringParam(params, PARAMS.district),
    longitude: getNumberParam(params, PARAMS.longitude),
    latitude: getNumberParam(params, PARAMS.latitude),
    radius: getNumberParam(params, PARAMS.radius),
  };
  return query;
};
