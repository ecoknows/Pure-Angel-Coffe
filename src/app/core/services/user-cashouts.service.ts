import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { environment } from '@env';
import { Store } from '@ngrx/store';
import { AuthService } from './auth.service';
import { SnackbarComponent } from '@shared/components';
import { CashoutsState } from '@core/redux/cashouts/cashouts.reducer';
import { setCashouts } from '@core/redux/cashouts/cashouts.actions';
import { ReceiptDialogComponent } from '@features/dashboard/components/receipt-dialog/receipt-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import * as moment from 'moment';

@Injectable({
  providedIn: 'root',
})
export class UserCashoutsService {
  snackBarDuration = 2;

  constructor(
    private http: HttpClient,
    private authService: AuthService,
    private store: Store<{}>,
    private _snackBar: MatSnackBar,
    public dialog: MatDialog
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

  approveCashout(cashout: CashoutsState) {
    this.http
      .post<{ message: string }>(
        environment.api + 'api/user-cashouts/approve-cashout',
        {
          cashout,
        },
        {
          headers: this.authService.headers,
        }
      )
      .subscribe(
        (response) => {
          this.fetchCashouts();
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
          this.dialog.open(ReceiptDialogComponent, {
            data: {
              amount,
              mode_of_withdrawal,
              date: moment,
            },
          });
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
