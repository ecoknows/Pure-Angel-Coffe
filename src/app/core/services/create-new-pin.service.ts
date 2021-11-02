import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { setSearchedAccountNumber } from '@core/redux/create-new-pin/create-new-pin.actions';
import { CreateNewPinState } from '@core/redux/create-new-pin/create-new-pin.reducers';
import { UserState } from '@core/redux/user/user.reducer';
import { environment } from '@env';
import { Store } from '@ngrx/store';
import { AuthService } from './auth.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SnackbarComponent } from '@shared/components';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class CreateNewPinService {
  snackBarDuration = 2;

  constructor(
    private http: HttpClient,
    private authService: AuthService,
    private store: Store<{}>,
    private _snackBar: MatSnackBar,
    private router: Router
  ) {}

  findAccount(account_number: string, stepper: any) {
    this.http
      .post<{ message: string; data: CreateNewPinState }>(
        environment.api + 'api/create-new-pin/search-account',
        { account_number },
        { headers: this.authService.headers }
      )
      .subscribe(
        (response) => {
          const data = response.data;

          if (data && (data.is_mega_center || data.is_stockist)) {
            stepper.next();
            this.store.dispatch(setSearchedAccountNumber({ user: data }));
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

  createPin(account_number: string, number_of_pin: number) {
    this.http
      .post<{ message: string }>(
        environment.api + 'api/create-new-pin/assign-pin',
        { account_number, number_of_pin },
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
          this.router.navigate(['/admin']);
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
