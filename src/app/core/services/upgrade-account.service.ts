import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import {
  resetSearchAccount,
  setSearchAccount,
  setSearchMegaCenters,
} from '@core/redux/search-account/search-account.actions';
import { UserState } from '@core/redux/user/user.reducer';
import { environment } from '@env';
import { Store } from '@ngrx/store';
import { SnackbarComponent } from '@shared/components';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class UpgradeAccountService {
  snackBarDuration = 2;

  constructor(
    private http: HttpClient,
    private authService: AuthService,
    private store: Store<{}>,
    private _snackBar: MatSnackBar
  ) {}

  searchAccount(account_number: string, stepper: any) {
    this.http
      .post<{ message: string; data: UserState }>(
        environment.api + 'api/upgrade-account/search-account',
        { account_number },
        { headers: this.authService.headers }
      )
      .subscribe(
        (response) => {
          const data = response.data;

          if (data) {
            stepper.next();
            this.store.dispatch(setSearchAccount({ user: data }));
          }
        },
        (error) => {
          this._snackBar.openFromComponent(SnackbarComponent, {
            duration: this.snackBarDuration * 1000,
            verticalPosition: 'top',
            horizontalPosition: 'center',
            panelClass: ['snackbar-background'],
            data: {
              message: error.error.message,
              error: true,
            },
          });
        }
      );
  }

  searchMegaCenters() {
    this.http
      .get<{ message: string; data: UserState[] }>(
        environment.api + 'api/upgrade-account/search-mega-centers',
        { headers: this.authService.headers }
      )
      .subscribe(
        (response) => {
          const data = response.data;

          if (data) {
            this.store.dispatch(setSearchMegaCenters({ list: data }));
          }
        },
        (error) => {
          this._snackBar.openFromComponent(SnackbarComponent, {
            duration: this.snackBarDuration * 1000,
            verticalPosition: 'top',
            horizontalPosition: 'center',
            panelClass: ['snackbar-background'],
            data: {
              message: error.error.message,
              error: true,
            },
          });
        }
      );
  }

  upgrade(
    account_info: {
      account_id: string;
      status: string;
      area_code: string | undefined;
      assign_area: string | undefined;
      mega_center: string | undefined;
    },
    stepper: any
  ) {
    this.http
      .post<{ message: string }>(
        environment.api + 'api/upgrade-account/upgrade',
        { ...account_info },
        { headers: this.authService.headers }
      )
      .subscribe(
        (response) => {
          this._snackBar.openFromComponent(SnackbarComponent, {
            duration: this.snackBarDuration * 1000,
            verticalPosition: 'top',
            horizontalPosition: 'center',
            panelClass: ['snackbar-background'],
            data: {
              message: response.message,
            },
          });

          stepper.reset();
        },
        (error) => {
          this._snackBar.openFromComponent(SnackbarComponent, {
            duration: this.snackBarDuration * 1000,
            verticalPosition: 'top',
            horizontalPosition: 'center',
            panelClass: ['snackbar-background'],
            data: {
              message: error.error.message,
              error: true,
            },
          });
        }
      );
  }
}
