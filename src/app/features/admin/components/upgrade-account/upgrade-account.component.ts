import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserState } from '@core/redux/user/user.reducer';
import { UpgradeAccountService } from '@core/services/upgrade-account.service';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';

import { MatSnackBar } from '@angular/material/snack-bar';
import { SnackbarComponent } from '@shared/components';
import { resetSearchAccount } from '@core/redux/search-account/search-account.actions';

@Component({
  selector: 'app-upgrade-account',
  templateUrl: './upgrade-account.component.html',
  styleUrls: ['./upgrade-account.component.sass'],
})
export class UpgradeAccountComponent implements OnInit {
  isLinear = true;
  firstFormGroup!: FormGroup;
  secondFormGroup!: FormGroup;

  searchAccount$: Observable<UserState>;

  constructor(
    private _formBuilder: FormBuilder,
    private store: Store<{ searchAccountReducer: UserState }>,
    private upgradeAccountService: UpgradeAccountService,

    private _snackBar: MatSnackBar
  ) {
    this.searchAccount$ = this.store.select('searchAccountReducer');
  }

  ngOnInit() {
    this.firstFormGroup = this._formBuilder.group({
      account_number: ['', Validators.required],
    });
    this.secondFormGroup = this._formBuilder.group({
      status: ['', Validators.required],
      assign_area: [''],
    });

    this.store.dispatch(resetSearchAccount());
  }

  upgrade(search_account: UserState, stepper: any) {
    const status = this.secondFormGroup.get('status')?.value;
    const assign_area = this.secondFormGroup.get('assign_area')?.value;

    if (search_account._id) {
      this.upgradeAccountService.upgrade(
        {
          account_id: search_account._id,
          status,
          assign_area,
        },
        stepper
      );
    }
  }

  searchAccount(stepper: any) {
    const account_number = this.firstFormGroup.get('account_number')?.value;
    if (account_number) {
      this.store.dispatch(resetSearchAccount());

      this.upgradeAccountService.searchAccount(account_number, stepper);
    }
  }

  checkIfMegaCenter(stepper: any) {
    const status = this.secondFormGroup.get('status')?.value;
    const assign_area = this.secondFormGroup.get('assign_area')?.value;

    if (status == 'mega-center') {
      if (assign_area) {
        stepper.next();
      } else {
        this._snackBar.openFromComponent(SnackbarComponent, {
          duration: 2 * 1000,
          verticalPosition: 'top',
          horizontalPosition: 'center',
          panelClass: ['snackbar-background'],
          data: {
            message: 'Assign Area is need in Mega Center',
            error: true,
          },
        });
      }
    } else {
      stepper.next();
    }
  }
}
