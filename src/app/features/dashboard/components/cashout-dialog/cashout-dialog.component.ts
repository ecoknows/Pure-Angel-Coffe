import { Component } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { UserState } from '@core/redux/user/user.reducer';
import { AuthService } from '@core/services/auth.service';
import { UserCashoutsService } from '@core/services/user-cashouts.service';
import { Store } from '@ngrx/store';
import { WITHDRAWAL_CHARGE } from '@server/constants';
import { LimitValidators } from '@shared/validators/limit.validators';
import { CommonErrorStateMatcher } from '@shared/validators/login.validators';
import { Observable } from 'rxjs';
import { ReceiptDialogComponent } from '../receipt-dialog/receipt-dialog.component';

@Component({
  selector: 'app-cashout-dialog',
  templateUrl: './cashout-dialog.component.html',
  styleUrls: ['./cashout-dialog.component.sass'],
})
export class CashoutDialogComponent {
  overall_cash = 0;
  form: FormGroup;
  user$: Observable<UserState>;

  matcher = new CommonErrorStateMatcher();
  constructor(
    private userCashoutsService: UserCashoutsService,
    private fb: FormBuilder,
    public dialog: MatDialog,
    private store: Store<{ userReducer: UserState }>
  ) {
    this.user$ = this.store.select('userReducer');
    this.form = fb.group({
      amount: [0, null, LimitValidators.limitMoney(this.user$)],
      mode_of_withdrawal: ['cash'],
    });
  }

  get withdrawalCharge() {
    return WITHDRAWAL_CHARGE;
  }

  getLimitWithdrawal(user: UserState | null) {
    if (user?.unpaid_income) {
      return user.unpaid_income - WITHDRAWAL_CHARGE;
    }
    return 0;
  }

  cashout() {
    const amount = this.form.get('amount')?.value;
    const mode_of_withdrawal = this.form.get('mode_of_withdrawal')?.value;
    this.userCashoutsService.cashout(amount, mode_of_withdrawal);
  }
}
