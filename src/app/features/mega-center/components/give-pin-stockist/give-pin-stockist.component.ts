import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserState } from '@core/redux/user/user.reducer';
import { AuthService } from '@core/services/auth.service';
import { GivePinToStockistService } from '@core/services/give-pin-to-stockist.service';
import { Store } from '@ngrx/store';
import {
  COFFEE_PACKAGE_PER_PIN,
  SOAP_PACKAGE_PER_PIN,
} from '@server/constants';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-give-pin-stockist',
  templateUrl: './give-pin-stockist.component.html',
  styleUrls: ['./give-pin-stockist.component.sass'],
})
export class GivePinStockistComponent implements OnInit {
  isLinear = true;
  firstFormGroup!: FormGroup;
  secondFormGroup!: FormGroup;
  searchAccount$: Observable<UserState>;
  user$: Observable<UserState>;

  constructor(
    private _formBuilder: FormBuilder,
    private givePinToStockistService: GivePinToStockistService,
    private authService: AuthService,
    private store: Store<{
      searchAccountReducer: UserState;
      userReducer: UserState;
    }>
  ) {
    this.searchAccount$ = this.store.select('searchAccountReducer');
    this.user$ = this.store.select('userReducer');
  }

  ngOnInit() {
    this.firstFormGroup = this._formBuilder.group({
      account_number: ['', Validators.required],
    });
    this.secondFormGroup = this._formBuilder.group({
      addedPin: ['', Validators.required],
    });

    this.authService.fetchUserDetails();
  }

  pinRange(user: null | UserState) {
    if (user) {
      if (user.ending_pin != undefined && user?.number_of_pin) {
        if (user.number_of_pin > 0) {
          const starting = (user.ending_pin + 1).toString();
          const ending = (user.ending_pin + user.number_of_pin).toString();

          return (
            user.secret_code_suffix +
            '0' +
            starting +
            ' to ' +
            user.secret_code_suffix +
            '0' +
            ending
          );
        }
      } else {
        return 'Out of Stock';
      }
    }

    return 'Unavailable';
  }

  searchAccount(stepper: any) {
    const account_number = this.firstFormGroup.get('account_number')?.value;

    if (account_number) {
      this.givePinToStockistService.resetAccount();
      this.givePinToStockistService.searchAccount(account_number, stepper);
    }
  }

  searchAccountAccountDetails(stepper: any) {
    const account_number = this.firstFormGroup.get('account_number')?.value;

    if (account_number) {
      this.givePinToStockistService.searchAccount(account_number, stepper);
    }
  }

  givePIN(stepper: any) {
    const account_number = this.firstFormGroup.get('account_number')?.value;
    const addedPin = this.secondFormGroup.get('addedPin')?.value;
    if (account_number && addedPin) {
      this.givePinToStockistService.givePin(account_number, addedPin, stepper);
    }
  }

  startingPin(user: UserState | null, mega_center: UserState | null) {
    if (user && mega_center) {
      if (user.ending_pin == undefined && user.number_of_pin == undefined) {
        if (mega_center && mega_center.ending_pin != undefined) {
          return mega_center.ending_pin + 1;
        }
      } else {
        if (user && user.ending_pin != undefined) {
          return user.ending_pin + 1;
        }
      }
    }
    return undefined;
  }

  endingPin(user: UserState | null, mega_center: UserState | null) {
    const addedPin = this.secondFormGroup.get('addedPin')?.value;

    if (user && addedPin && mega_center) {
      if (user.ending_pin != undefined && user.number_of_pin != undefined) {
        return user.ending_pin + addedPin + user.number_of_pin;
      }

      if (user.ending_pin == undefined && user.number_of_pin != undefined) {
        return addedPin + user.number_of_pin;
      }

      if (user.ending_pin != undefined && user.number_of_pin == undefined) {
        return user.ending_pin + addedPin;
      }

      return mega_center.ending_pin + addedPin;
    }

    return undefined;
  }

  totalPins(user: UserState | null) {
    const addedPin = this.secondFormGroup.get('addedPin')?.value;
    if (user && addedPin) {
      if (user.number_of_pin != undefined) {
        return user.number_of_pin + addedPin;
      }
    }

    return addedPin;
  }

  yourCoffeeBox(user: UserState | null) {
    if (user) {
      if (user.stock_coffee != undefined) {
        const addedPin = this.secondFormGroup.get('addedPin')?.value;
        const minusCoffeeBox = addedPin * COFFEE_PACKAGE_PER_PIN;
        const totalCoffeeBox = user.stock_coffee - minusCoffeeBox;
        return (
          user.stock_coffee.toString() +
          ' - ' +
          minusCoffeeBox.toString() +
          ' ( ' +
          totalCoffeeBox +
          ' Boxes ) '
        );
      }
    }

    return undefined;
  }

  yourSoapBox(user: UserState | null) {
    if (user) {
      if (user.stock_soap != undefined) {
        const addedPin = this.secondFormGroup.get('addedPin')?.value;
        const minusSoapBox = addedPin * SOAP_PACKAGE_PER_PIN;
        const totalSoapBox = user.stock_soap - minusSoapBox;
        return (
          user.stock_soap.toString() +
          ' - ' +
          minusSoapBox.toString() +
          ' ( ' +
          totalSoapBox +
          ' Boxes ) '
        );
      }
    }

    return undefined;
  }

  buyerCoffeeBox(user: UserState | null) {
    if (user) {
      if (user.stock_coffee != undefined) {
        const addedPin = this.secondFormGroup.get('addedPin')?.value;
        const addedCoffeBox = addedPin * COFFEE_PACKAGE_PER_PIN;
        const totalCoffeeBox = user.stock_coffee + addedCoffeBox;
        return (
          user.stock_coffee.toString() +
          ' + ' +
          addedCoffeBox.toString() +
          ' ( ' +
          totalCoffeeBox +
          ' Boxes ) '
        );
      } else {
        const addedPin = this.secondFormGroup.get('addedPin')?.value;
        const addedCoffeBox = addedPin * COFFEE_PACKAGE_PER_PIN;
        const totalCoffeeBox = addedCoffeBox;
        return (
          '0 + ' +
          addedCoffeBox.toString() +
          ' ( ' +
          totalCoffeeBox +
          ' Boxes ) '
        );
      }
    }

    return undefined;
  }

  buyerSoapBox(user: UserState | null) {
    if (user) {
      if (user.stock_soap != undefined) {
        const addedPin = this.secondFormGroup.get('addedPin')?.value;
        const addedSoapBox = addedPin * SOAP_PACKAGE_PER_PIN;
        const totalSoapBox = user.stock_soap + addedSoapBox;
        return (
          user.stock_soap.toString() +
          ' + ' +
          addedSoapBox.toString() +
          ' ( ' +
          totalSoapBox +
          ' Boxes ) '
        );
      } else {
        const addedPin = this.secondFormGroup.get('addedPin')?.value;
        const addedSoapBox = addedPin * 4;
        const totalSoapBox = addedSoapBox;
        return (
          '0 + ' + addedSoapBox.toString() + ' ( ' + totalSoapBox + ' Boxes ) '
        );
      }
    }

    return undefined;
  }
}
