import {
  AbstractControl,
  AsyncValidatorFn,
  FormControl,
  ValidationErrors,
} from '@angular/forms';
import { UserState } from '@core/redux/user/user.reducer';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';

export class LimitValidators {
  static limitMoney(user$: Observable<UserState>): AsyncValidatorFn {
    return (control: AbstractControl): Observable<ValidationErrors> => {
      return user$.pipe(
        map((result: any) => {
          if (result.unpaid_income < control.value || control.value < 100) {
            control.setErrors({ amountExceed: true });
          }
          return { amountExceed: true };
        })
      );
    };
  }

  static limitSupply(control: AbstractControl): ValidationErrors | null {
    if ((control.value as number) <= 0)
      return {
        supplyExceed: true,
      };

    return null;
  }

  static limitPurchase(control: AbstractControl): ValidationErrors | null {
    if ((control.value as number) <= 0)
      return {
        purchaseExceed: true,
      };

    return null;
  }
}
