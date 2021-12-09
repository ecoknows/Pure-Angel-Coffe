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
  stockist_area_code?: string;

  ending_pin?: number;
  number_of_pin?: number;

  overall_income?: number;
  unpaid_income?: number;

  stock_coffee?: number;
  stock_soap?: number;

  pin_stock_coffee?: number;
  pin_stock_soap?: number;

  stock_coffee_b1t1?: number;
  stock_soap_b1t1?: number;

  stock_coffee_b2t3?: number;
  stock_soap_b2t3?: number;

  b1t1_ae_rebates?: number;
  b2t3_ae_rebates?: number;

  coffee_income?: number;
  soap_income?: number;

  b1t1_stockist_encode_new_order?: number;
  b2t3_stockist_encode_new_order?: number;

  stockist_repeat_purchase_coffee?: number;
  stockist_repeat_purchase_soap?: number;

  number_of_members?: number;
  number_of_stockist?: number;
  number_of_mega_center?: number;

  direct_referral?: number;
  indirect_referral?: number;
  pairing_bonus?: number;
  automatic_equivalent_rebates?: number;
  new_member_income?: number;
  product_voucher?: number;

  inventory?: {
    coffee_income: number;
    soap_income: number;
  };

  is_admin?: boolean;
  is_owner?: boolean;
  is_stockist?: boolean;
  is_mega_center?: boolean;
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
