import { createReducer, on } from '@ngrx/store';
import { setCashouts, resetCashouts } from './cashouts.actions';

export interface CashoutsState {
  user_id?: string;
  account_number?: string;

  first_name?: string;
  last_name?: string;
  address?: string;
  contact_number?: string;

  amount?: number;
  is_claimed?: boolean;
  mode_of_withdrawal?: string;

  createdAt?: string;
}

export const CASHOUTS_INITIAL_STATE: CashoutsState[] = [];

const CASHOUTS_REDUCER = createReducer(
  CASHOUTS_INITIAL_STATE,
  on(setCashouts, (state, { list }) => list),
  on(resetCashouts, (state) => [])
);

export function cashoutsReducer(state: any, action: any) {
  return CASHOUTS_REDUCER(state, action);
}
