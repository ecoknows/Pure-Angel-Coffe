import { createAction, props } from '@ngrx/store';
import { CashoutsState } from './cashouts.reducer';

export const setCashouts = createAction(
  'Set Cashouts',
  props<{ list: CashoutsState[] }>()
);

export const resetCashouts = createAction('Reset Cashouts');
