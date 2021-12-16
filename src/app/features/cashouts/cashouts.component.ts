import { Component, OnInit } from '@angular/core';
import { CashoutsState } from '@core/redux/cashouts/cashouts.reducer';
import { UserState } from '@core/redux/user/user.reducer';
import { UserCashoutsService } from '@core/services/user-cashouts.service';
import { Store } from '@ngrx/store';
import { ColumnMode } from '@swimlane/ngx-datatable';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-cashouts',
  templateUrl: './cashouts.component.html',
  styleUrls: ['./cashouts.component.sass'],
})
export class CashoutsComponent implements OnInit {
  dataSource$: Observable<CashoutsState[]>;
  user$: Observable<UserState>;
  ColumnMode = ColumnMode;

  title!: string | null;

  constructor(
    private store: Store<{
      cashoutsReducer: CashoutsState[];
      userReducer: UserState;
    }>,
    private userCashoutsService: UserCashoutsService
  ) {
    this.dataSource$ = this.store.select('cashoutsReducer');
    this.user$ = this.store.select('userReducer');
  }

  ngOnInit(): void {
    this.userCashoutsService.fetchCashouts();
  }

  approvedCashout(cashout: CashoutsState) {
    this.userCashoutsService.approveCashout(cashout);
  }

  modeOfWithdrawal(mode: string) {
    if (mode == 'gcash') {
      return 'G-Cash';
    }

    switch (mode) {
      case 'gcash':
        return 'G-Cash';
      case 'atm':
        return 'ATM';
      case 'check':
        return 'Check';
      case 'cash':
        return 'Cash';
    }

    return '';
  }
}
