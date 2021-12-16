import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Genealogy } from '@core/redux/genealogy/genealogy.model';
import { UserState } from '@core/redux/user/user.reducer';
import { AuthService } from '@core/services/auth.service';
import { NewMemberService } from '@core/services/new-member.service';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-new-member',
  templateUrl: './new-member.component.html',
  styleUrls: ['./new-member.component.sass'],
})
export class NewMemberComponent implements OnInit {
  isLinear = true;
  firstFormGroup!: FormGroup;
  secondFormGroup!: FormGroup;

  placeUnder$: Observable<Genealogy>;
  user$: Observable<UserState>;
  referralUser$: Observable<UserState>;
  placeUnderUser$: Observable<UserState>;

  constructor(
    private _formBuilder: FormBuilder,
    private newMemberService: NewMemberService,
    private authService: AuthService,
    private store: Store<{
      searchGenealogyReducer: Genealogy;
      userReducer: UserState;
      searchReferralAccountReducer: UserState;
      searchPlaceUnderAccountReducer: UserState;
    }>
  ) {
    this.placeUnder$ = this.store.select('searchGenealogyReducer');
    this.user$ = this.store.select('userReducer');
    this.referralUser$ = this.store.select('searchReferralAccountReducer');
    this.placeUnderUser$ = this.store.select('searchPlaceUnderAccountReducer');
  }

  ngOnInit() {
    this.firstFormGroup = this._formBuilder.group({
      first_name: ['', Validators.required],
      last_name: ['', Validators.required],
      contact_number: ['', Validators.required],
    });
    this.secondFormGroup = this._formBuilder.group({
      referral_account: ['', Validators.required],
      place_under_account: ['', Validators.required],
      position: ['', Validators.required],
    });
    this.authService.fetchUserDetails();
    this.newMemberService.resetGenealogy();
  }

  createMember(user: UserState | null, stepper: any) {
    const first_name = this.firstFormGroup.get('first_name')?.value;
    const last_name = this.firstFormGroup.get('last_name')?.value;
    const contact_number = this.firstFormGroup.get('contact_number')?.value;

    const referral_account =
      this.secondFormGroup.get('referral_account')?.value;
    const place_under_account = this.secondFormGroup.get(
      'place_under_account'
    )?.value;
    const position = this.secondFormGroup.get('position')?.value;

    if (user && user.ending_pin && user.number_of_pin) {
      const account_number = this.getFirstPin(user);
      const user_number = user.ending_pin + 1;

      const member_info = {
        first_name,
        last_name,
        contact_number,
        referral_account,
        place_under_account,
        position,
        account_number,
        user_number,
      };

      this.newMemberService.createMember(member_info, stepper);
    }
  }

  searchPlaceUnder() {
    const place_under_account = this.secondFormGroup.get(
      'place_under_account'
    )?.value;

    this.secondFormGroup.get('position')?.setValue('');

    this.newMemberService.searchGenealogy(place_under_account);
  }

  searchAccounts(stepper: any) {
    const referral_account =
      this.secondFormGroup.get('referral_account')?.value;
    const place_under_account = this.secondFormGroup.get(
      'place_under_account'
    )?.value;

    if (referral_account && place_under_account) {
      this.newMemberService.searchReferralAccount(referral_account);
      this.newMemberService.searchPlaceUnderAccount(place_under_account);

      stepper.next();
    }
  }

  isLeft(place_under: Genealogy | null): boolean {
    if (
      (place_under?.user_id && place_under?.left_branch == undefined) ||
      place_under?.newly_created
    ) {
      return false;
    }
    return true;
  }

  isRight(place_under: Genealogy | null): boolean {
    if (
      (place_under?.user_id && place_under?.right_branch == undefined) ||
      place_under?.newly_created
    ) {
      return false;
    }
    return true;
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

  getFirstPin(user: null | UserState) {
    if (user) {
      if (user?.ending_pin && user?.number_of_pin) {
        if (user.number_of_pin > 0) {
          const starting = (user.ending_pin + 1).toString();
          const user_area_code = user.secret_code_suffix;
          return user_area_code + '0' + starting;
        }
      }
    }
    return null;
  }

  get NewMemberInfo() {
    return {
      first_name: this.firstFormGroup.get('first_name')?.value,
      last_name: this.firstFormGroup.get('last_name')?.value,
      contact_number: this.firstFormGroup.get('contact_number')?.value,

      referral_account: this.secondFormGroup.get('referral_account')?.value,
      place_under_account: this.secondFormGroup.get('place_under_account')
        ?.value,
      position: this.secondFormGroup.get('position')?.value,
    };
  }

  canStock(user: UserState | null) {
    if (user?.number_of_pin) {
      if (user.number_of_pin > 0) {
        return true;
      }
    }
    return false;
  }
}
