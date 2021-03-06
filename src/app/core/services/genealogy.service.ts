import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';
import {
  setGenealogy,
  fetchRoot,
} from '@core/redux/genealogy/genealogy.actions';
import { Genealogy } from '@core/redux/genealogy/genealogy.model';
import { setUserData } from '@core/redux/user/user.actions';
import { environment } from '@env';
import { Store } from '@ngrx/store';
import { AuthService } from './auth.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SnackbarComponent } from '@shared/components';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class GenealogyService {
  snackBarDuration = 2;

  constructor(
    private http: HttpClient,
    private authService: AuthService,
    private store: Store<{}>,
    private _snackBar: MatSnackBar,
    private router: Router
  ) {}

  fetchDefaultGenealogy() {
    const helper = new JwtHelperService();
    const token = this.authService.userToken;

    if (token) {
      const user = helper.decodeToken(token);

      this.store.dispatch(
        setGenealogy({
          genealogy: {
            user_id: user._id,
            account_number: user.account_number,
            first_name: user.first_name,
            last_name: user.last_name,
            address: user.address,
            left_count: 0,
            right_count: 0,
          },
        })
      );

      this.store.dispatch(setUserData({ user }));
    }
  }

  fetchGenealogy() {
    this.http
      .get<{ message: string; data: Genealogy }>(
        environment.api + 'api/genealogy/',
        {
          headers: this.authService.headers,
        }
      )
      .subscribe(
        (result) => {
          let data = result.data;

          if (data) {
            this.store.dispatch(setGenealogy({ genealogy: data }));
          } else {
            this.fetchDefaultGenealogy();
          }
        },
        (error) => {
          this.fetchDefaultGenealogy();
        }
      );
  }

  viewChild(user_id: string | undefined) {
    this.http
      .post<{
        message: string;
        data: Genealogy;
      }>(
        environment.api + 'api/genealogy/view-child',
        {
          user_id,
        },
        {
          headers: this.authService.headers,
        }
      )
      .subscribe((result) => {
        let data = result.data;

        if (data) {
          this.store.dispatch(setGenealogy({ genealogy: data }));
        }
      });
  }

  viewParent(user_id: string | undefined) {
    this.http
      .post<{
        message: string;
        data: Genealogy;
      }>(
        environment.api + 'api/genealogy/view-parent',
        {
          user_id,
        },
        {
          headers: this.authService.headers,
        }
      )
      .subscribe((result) => {
        let data = result.data;

        if (data) {
          this.store.dispatch(setGenealogy({ genealogy: data }));
        }
      });
  }
  searchAccount(account_number: string | undefined) {
    this.http
      .post<{
        message: string;
        data: Genealogy;
      }>(
        environment.api + 'api/genealogy/search-account',
        {
          account_number,
        },
        {
          headers: this.authService.headers,
        }
      )
      .subscribe(
        (response) => {
          let data = response.data;

          if (data) {
            this.router.navigate(['/genealogy']);
            this._snackBar.openFromComponent(SnackbarComponent, {
              duration: this.snackBarDuration * 1000,
              verticalPosition: 'top',
              horizontalPosition: 'center',
              panelClass: ['snackbar-background'],
              data: {
                message: response.message,
              },
            });
            this.store.dispatch(setGenealogy({ genealogy: data }));
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

  fetchLeaves(user_id: string | undefined) {
    this.http
      .post<{
        message: string;
        data: Genealogy;
        isReach: boolean;
      }>(
        environment.api + 'api/genealogy/fetch-leave',
        {
          user_id,
        },
        {
          headers: this.authService.headers,
        }
      )
      .subscribe((response) => {
        let data = response.data;

        if (data) {
          this._snackBar.openFromComponent(SnackbarComponent, {
            duration: this.snackBarDuration * 1000,
            verticalPosition: 'top',
            horizontalPosition: 'center',
            panelClass: ['snackbar-background'],
            data: {
              message: response.message,
            },
          });

          this.store.dispatch(fetchRoot({ root: data }));
        }
      });
  }
}
