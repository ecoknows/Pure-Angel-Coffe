import { createReducer, on } from '@ngrx/store';
import { resetUserData, setUserData } from './user.actions';

export interface UserState {
  _id?: string;
  username?: string;
  first_name?: string;
  last_name?: string;
  address?: string;
  birthdate?: string;
  contact_number?: string;

  overall_income?: number;
  unpaid_income?: number;

  direct_referral?: number;
  indirect_referral?: number;
  pairing_bonus?: number;
  automatic_equivalent_rebates?: number;
}

export const USER_INITIAL_STATE: UserState = {};

const USER_REDUCER = createReducer(
  USER_INITIAL_STATE,
  on(setUserData, (state, { user }) => ({ ...state, ...user })),
  on(resetUserData, (state) => ({}))
);

export function userReducer(state: any, action: any) {
  return USER_REDUCER(state, action);
}
