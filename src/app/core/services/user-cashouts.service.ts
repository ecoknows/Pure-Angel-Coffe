import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { environment } from '@env';
import { Store } from '@ngrx/store';
import { AuthService } from './auth.service';
import { SnackbarComponent } from '@shared/components';
import { CashoutsState } from '@core/redux/cashouts/cashouts.reducer';
import { setCashouts } from '@core/redux/cashouts/cashouts.actions';

@Injectable({
  providedIn: 'root',
})
export class UserCashoutsService {
  snackBarDuration = 2;

  constructor(
    private http: HttpClient,
    private authService: AuthService,
    private store: Store<{}>,
    private _snackBar: MatSnackBar
  ) {}

  fetchCashouts() {
    this.http
      .get<{ message: string; data: CashoutsState[] }>(
        environment.api + 'api/user-cashouts/',
        { headers: this.authService.headers }
      )
      .subscribe(
        (response) => {
          const data = response.data;
          if (data) {
            this.store.dispatch(setCashouts({ list: data }));

            this._snackBar.openFromComponent(SnackbarComponent, {
              duration: this.snackBarDuration * 1000,
              verticalPosition: 'top',
              horizontalPosition: 'center',
              panelClass: ['snackbar-background'],
              data: {
                message: response.message,
              },
            });
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

  cashout(amount: number, mode_of_withdrawal: string) {
    this.http
      .post<{ message: string }>(
        environment.api + 'api/user-cashouts/cashout',
        {
          amount: amount,
          mode_of_withdrawal: mode_of_withdrawal,
        },
        {
          headers: this.authService.headers,
        }
      )
      .subscribe(
        (response) => {
          this.authService.fetchUserDetails();
          this._snackBar.openFromComponent(SnackbarComponent, {
            duration: this.snackBarDuration * 1000,
            verticalPosition: 'top',
            horizontalPosition: 'center',
            panelClass: ['snackbar-background'],
            data: {
              message: response.message,
            },
          });
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
