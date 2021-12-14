import { Component } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { UserState } from '@core/redux/user/user.reducer';
import { AuthService } from '@core/services/auth.service';
import { UserCashoutsService } from '@core/services/user-cashouts.service';
import { Store } from '@ngrx/store';
import { LimitValidators } from '@shared/validators/limit.validators';
import { CommonErrorStateMatcher } from '@shared/validators/login.validators';
import { Observable } from 'rxjs';

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
    private store: Store<{ userReducer: UserState }>
  ) {
    this.user$ = this.store.select('userReducer');
    this.form = fb.group({
      amount: [0, null, LimitValidators.limitMoney(this.user$)],
      mode_of_withdrawal: ['cash_on_hand'],
    });
  }

  cashout() {
    const amount = this.form.get('amount')?.value;
    const mode_of_withdrawal = this.form.get('mode_of_withdrawal')?.value;
    this.userCashoutsService.cashout(amount, mode_of_withdrawal);
  }
}
