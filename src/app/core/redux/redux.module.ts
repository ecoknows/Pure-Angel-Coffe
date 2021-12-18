import { NgModule } from '@angular/core';
import { StoreModule } from '@ngrx/store';
import { userReducer } from './user/user.reducer';
import { genealogyReducer } from './genealogy/genealogy.reducer';
import {
  searchAccountReducer,
  searchGenealogyReducer,
  searchReferralAccountReducer,
  searchPlaceUnderAccountReducer,
  searchMegaCenterAccountReducer,
  searchMegaCentersReducer,
} from './search-account/search-account.reducers';
import { incomeHistoryReducer } from './income-history/income-history.reducer';
import { pinHistoryReducer } from './pin-history/pin-history.reducer';
import { cashoutsReducer } from './cashouts/cashouts.reducer';

const reducer: object = {
  genealogyReducer: genealogyReducer,
  userReducer: userReducer,
  searchAccountReducer: searchAccountReducer,
  searchReferralAccountReducer: searchReferralAccountReducer,
  searchMegaCenterAccountReducer: searchMegaCenterAccountReducer,
  searchPlaceUnderAccountReducer: searchPlaceUnderAccountReducer,
  searchMegaCentersReducer: searchMegaCentersReducer,
  searchGenealogyReducer: searchGenealogyReducer,
  incomeHistoryReducer: incomeHistoryReducer,
  pinHistoryReducer: pinHistoryReducer,
  cashoutsReducer: cashoutsReducer,
};

@NgModule({
  declarations: [],
  imports: [StoreModule.forRoot(reducer)],
})
export class ReduxModule {}
