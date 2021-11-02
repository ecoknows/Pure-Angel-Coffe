import { createReducer, on } from '@ngrx/store';
import { resetUserData, setUserData } from './user.actions';

export interface UserState {
  _id?: string;
  account_number?: string;
  first_name?: string;
  last_name?: string;
  address?: string;
  birthdate?: string;
  contact_number?: string;

  max_member_to_verify?: number;
  member_that_verified?: number;
  secret_code_suffix?: string;

  ending_pin?: number;
  number_of_pin?: number;

  overall_income?: number;
  unpaid_income?: number;

  stock_coffee?: number;
  stock_soap?: number;

  number_of_members?: number;
  number_of_stockist?: number;
  number_of_mega_center?: number;

  direct_referral?: number;
  indirect_referral?: number;
  pairing_bonus?: number;
  automatic_equivalent_rebates?: number;
  is_admin?: boolean;
  is_owner?: boolean;
  number_of_supply?: number;
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
