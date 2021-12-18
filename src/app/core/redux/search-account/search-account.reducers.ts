import { createReducer, on } from '@ngrx/store';
import { Genealogy } from '../genealogy/genealogy.model';
import { UserState } from '../user/user.reducer';
import {
  resetSearchGenealogy,
  setSearchGenealogy,
  setSearchAccount,
  resetSearchAccount,
  setSearchReferralAccount,
  resetSearchReferralAccount,
  setSearchPlaceUnderAccount,
  resetSearchPlaceUnderAccount,
  setSearchMegaCenterAccount,
  resetSearchMegaCenterAccount,
  setSearchMegaCenters,
  resetSearchMegaCenters,
} from './search-account.actions';

export const SEARCH_GENEALOGY_INITIAL_STATE: Genealogy = {};
export const SEARCH_ACCOUNT_INITIAL_STATE: UserState = {};

export const SEARCH_MEGA_CENTER_ACCOUNT_INITIAL_STATE: UserState = {};

export const SEARCH_REFERRAL_ACCOUNT_INITIAL_STATE: UserState = {};
export const SEARCH_PLACE_UNDER_ACCOUNT_INITIAL_STATE: UserState = {};

export const SEARCH_MEGA_CENTERS: UserState[] = [];

const SEARCH_GENEALOGY_REDUCER = createReducer(
  SEARCH_GENEALOGY_INITIAL_STATE,
  on(setSearchGenealogy, (state, { genealogy }) => genealogy),
  on(resetSearchGenealogy, (state) => ({}))
);

const SEARCH_ACCOUNT_REDUCER = createReducer(
  SEARCH_ACCOUNT_INITIAL_STATE,
  on(setSearchAccount, (state, { user }) => ({ ...state, ...user })),
  on(resetSearchAccount, (state) => ({}))
);

const SEARCH_MEGA_CENTER_ACCOUNT_REDUCER = createReducer(
  SEARCH_MEGA_CENTER_ACCOUNT_INITIAL_STATE,
  on(setSearchMegaCenterAccount, (state, { user }) => ({ ...state, ...user })),
  on(resetSearchMegaCenterAccount, (state) => ({}))
);

const SEARCH_REFERRAL_ACCOUNT_REDUCER = createReducer(
  SEARCH_REFERRAL_ACCOUNT_INITIAL_STATE,
  on(setSearchReferralAccount, (state, { user }) => ({ ...state, ...user })),
  on(resetSearchReferralAccount, (state) => ({}))
);

const SEARCH_PLACE_UNDER_ACCOUNT_REDUCER = createReducer(
  SEARCH_PLACE_UNDER_ACCOUNT_INITIAL_STATE,
  on(setSearchPlaceUnderAccount, (state, { user }) => ({ ...state, ...user })),
  on(resetSearchPlaceUnderAccount, (state) => ({}))
);

const SEARCH_MEGA_CENTERS_REDUCER = createReducer(
  SEARCH_MEGA_CENTERS,
  on(setSearchMegaCenters, (state, { list }) => list),
  on(resetSearchMegaCenters, (state) => [])
);

export function searchGenealogyReducer(state: any, action: any) {
  return SEARCH_GENEALOGY_REDUCER(state, action);
}

export function searchAccountReducer(state: any, action: any) {
  return SEARCH_ACCOUNT_REDUCER(state, action);
}

export function searchMegaCenterAccountReducer(state: any, action: any) {
  return SEARCH_MEGA_CENTER_ACCOUNT_REDUCER(state, action);
}

export function searchReferralAccountReducer(state: any, action: any) {
  return SEARCH_REFERRAL_ACCOUNT_REDUCER(state, action);
}

export function searchPlaceUnderAccountReducer(state: any, action: any) {
  return SEARCH_PLACE_UNDER_ACCOUNT_REDUCER(state, action);
}

export function searchMegaCentersReducer(state: any, action: any) {
  return SEARCH_MEGA_CENTERS_REDUCER(state, action);
}
