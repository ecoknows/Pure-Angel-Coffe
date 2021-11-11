import { Component, OnInit } from '@angular/core';
import { UserState } from '@core/redux/user/user.reducer';
import { AuthService } from '@core/services/auth.service';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NewOrderService } from '@core/services/new-order.service';
import {
  COFFEE_B1T1_AE_REBATES,
  COFFEE_B1T1_SRP,
  COFFEE_B2T3_AE_REBATES,
  COFFEE_B2T3_SRP,
  SOAP_B1T1_AE_REBATES,
  SOAP_B1T1_SRP,
  SOAP_B2T3_AE_REBATES,
  SOAP_B2T3_SRP,
} from '@server/constants';

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
  referralUser$: Observable<UserState>;

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
    this.referralUser$ = this.store.select('searchReferralAccountReducer');
  }

  ngOnInit(): void {
    this.firstFormGroup = this._formBuilder.group({
      account_number: ['', Validators.required],
    });
    this.secondFormGroup = this._formBuilder.group({
      package: ['b1t1', Validators.required],
      coffee_quantity: [0],
      soap_quantity: [0],
    });

    this.authService.fetchUserDetails();
  }

  searchAccount(stepper: any) {
    const account_number = this.firstFormGroup.get('account_number')?.value;

    if (account_number) {
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
    const coffee_quantity = this.secondFormGroup.get('coffee_quantity')?.value;
    const soap_quantity = this.secondFormGroup.get('soap_quantity')?.value;

    if (soap_quantity || coffee_quantity) {
      stepper.next();
    }
  }

  orderCoffee() {
    const package_taken = this.secondFormGroup.get('package')?.value;
    const coffee_quantity = this.secondFormGroup.get('coffee_quantity')?.value;

    if (package_taken == 'b1t1' && coffee_quantity) {
      return (
        coffee_quantity.toString() +
        ' + ' +
        coffee_quantity.toString() +
        ' ( ' +
        (coffee_quantity * 2).toString() +
        ' Boxes )'
      );
    }

    if (package_taken == 'b2t3' && coffee_quantity) {
      return (
        (coffee_quantity * 2).toString() +
        ' + ' +
        (coffee_quantity * 3).toString() +
        ' ( ' +
        (coffee_quantity * 5).toString() +
        ' Boxes )'
      );
    }

    return '0 Boxes';
  }

  orderSoap() {
    const package_taken = this.secondFormGroup.get('package')?.value;
    const soap_quantity = this.secondFormGroup.get('soap_quantity')?.value;

    if (package_taken == 'b1t1' && soap_quantity) {
      return (
        soap_quantity.toString() +
        ' + ' +
        soap_quantity.toString() +
        ' ( ' +
        (soap_quantity * 2).toString() +
        ' Boxes )'
      );
    }

    if (package_taken == 'b2t3' && soap_quantity) {
      return (
        (soap_quantity * 2).toString() +
        ' + ' +
        (soap_quantity * 3).toString() +
        ' ( ' +
        (soap_quantity * 5).toString() +
        ' Boxes )'
      );
    }

    return '0 Boxes';
  }

  coffeeTotal() {
    const coffee_quantity =
      this.secondFormGroup.get('coffee_quantity')?.value || 0;
    const package_order = this.secondFormGroup.get('package')?.value;

    if (coffee_quantity && package_order) {
      if (package_order == 'b1t1') {
        return coffee_quantity * COFFEE_B1T1_SRP;
      }

      if (package_order == 'b2t3') {
        return coffee_quantity * COFFEE_B2T3_SRP;
      }
    }

    return 0;
  }

  soapTotal() {
    const soap_quantity = this.secondFormGroup.get('soap_quantity')?.value;
    const package_order = this.secondFormGroup.get('package')?.value;

    if (package_order) {
      if (package_order == 'b1t1') {
        return soap_quantity * SOAP_B1T1_SRP;
      }

      if (package_order == 'b2t3') {
        return soap_quantity * SOAP_B2T3_SRP;
      }
    }

    return 0;
  }

  total() {
    const soap_quantity = this.secondFormGroup.get('soap_quantity')?.value || 0;
    const coffee_quantity =
      this.secondFormGroup.get('coffee_quantity')?.value || 0;
    const package_order = this.secondFormGroup.get('package')?.value;

    if (package_order) {
      if (package_order == 'b1t1') {
        return (
          soap_quantity * SOAP_B1T1_SRP + coffee_quantity * COFFEE_B1T1_SRP
        );
      }

      if (package_order == 'b2t3') {
        return (
          soap_quantity * SOAP_B2T3_SRP + coffee_quantity * COFFEE_B2T3_SRP
        );
      }
    }

    return 0;
  }

  order(user: UserState | null, stepper: any) {
    const coffee_ordered = this.secondFormGroup.get('coffee_quantity')?.value;
    const soap_ordered = this.secondFormGroup.get('soap_quantity')?.value;
    const package_taken = this.secondFormGroup.get('package')?.value;

    if (user && user._id) {
      this.newOrderService.order(
        {
          buyer: user._id,
          coffee_ordered,
          soap_ordered,
          package: package_taken,
        },
        stepper,
        this.secondFormGroup
      );
    }
  }

  rebates() {
    const coffee_ordered = this.secondFormGroup.get('coffee_quantity')?.value;
    const soap_ordered = this.secondFormGroup.get('soap_quantity')?.value;
    const package_order = this.secondFormGroup.get('package')?.value;

    if (package_order) {
      if (package_order == 'b1t1') {
        return (
          coffee_ordered * COFFEE_B1T1_AE_REBATES +
          soap_ordered * SOAP_B1T1_AE_REBATES
        );
      }

      if (package_order == 'b2t3') {
        return (
          coffee_ordered * COFFEE_B2T3_AE_REBATES +
          soap_ordered * SOAP_B2T3_AE_REBATES
        );
      }
    }

    return 0;
  }
}
