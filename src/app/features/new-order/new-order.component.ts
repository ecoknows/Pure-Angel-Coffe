import { Component, OnInit } from '@angular/core';
import { UserState } from '@core/redux/user/user.reducer';
import { AuthService } from '@core/services/auth.service';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NewOrderService } from '@core/services/new-order.service';

@Component({
  selector: 'app-new-order',
  templateUrl: './new-order.component.html',
  styleUrls: ['./new-order.component.sass'],
})
export class NewOrderComponent implements OnInit {
  isLinear = true;
  firstFormGroup!: FormGroup;
  secondFormGroup!: FormGroup;

  user$: Observable<UserState>;
  searchAccount$: Observable<UserState>;

  constructor(
    private _formBuilder: FormBuilder,
    private newOrderService: NewOrderService,
    private authService: AuthService,
    private store: Store<{
      searchAccountReducer: UserState;
      searchReferralAccountReducer: UserState;
      userReducer: UserState;
    }>
  ) {
    this.user$ = this.store.select('userReducer');
    this.searchAccount$ = this.store.select('searchAccountReducer');
  }

  ngOnInit(): void {
    this.firstFormGroup = this._formBuilder.group({
      account_number: ['', Validators.required],
    });
    this.secondFormGroup = this._formBuilder.group({
      package: ['b1t1', Validators.required],
      coffee_package: [0],
      soap_package: [0],
    });

    this.authService.fetchUserDetails();
  }

  searchAccount(stepper: any) {
    const account_number = this.firstFormGroup.get('account_number')?.value;

    if (account_number) {
      this.newOrderService.resetAccounts();
      this.newOrderService.searchAccount(account_number, stepper);
    }
  }

  canOrder(user: UserState | null) {
    if (user?.stock_coffee) {
      if (user.stock_coffee > 0) {
        return true;
      }
    }

    if (user?.stock_soap) {
      if (user.stock_soap > 0) {
        return true;
      }
    }
    return false;
  }

  checkOrder(stepper: any) {
    const coffee_package = this.secondFormGroup.get('coffee_package')?.value;
    const soap_package = this.secondFormGroup.get('soap_package')?.value;

    if (soap_package || coffee_package) {
      stepper.next();
    }
  }

  order(user: UserState | null, stepper: any) {
    const coffee_package = this.secondFormGroup.get('coffee_package')?.value;
    const soap_package = this.secondFormGroup.get('soap_package')?.value;
    const package_taken = this.secondFormGroup.get('package')?.value;

    if (user && user._id) {
      this.newOrderService.order(
        {
          buyer: user._id,
          coffee_package,
          soap_package,
          package: package_taken,
        },
        stepper,
        this.secondFormGroup
      );
    }
  }

  b1t1SetConverter(quantity: number | undefined) {
    if (quantity) {
      return quantity / 2;
    }

    return 0;
  }

  b2t3SetConverter(quantity: number | undefined) {
    if (quantity) {
      return quantity / 5;
    }

    return 0;
  }
}
