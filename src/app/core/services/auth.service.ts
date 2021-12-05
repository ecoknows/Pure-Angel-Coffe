import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { UserState } from '@core/redux/user/user.reducer';
import { Store } from '@ngrx/store';
import { resetUserData, setUserData } from '@core/redux/user/user.actions';
import { SidebarService } from './sidebar.service';
import { resetGenealogy } from '@core/redux/genealogy/genealogy.actions';
import { JwtHelperService } from '@auth0/angular-jwt';
import { environment } from '@env';
import { FormGroup } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SnackbarComponent } from '@shared/components';
import { TopBarService } from './top-bar.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  snackBarDuration = 2;

  constructor(
    private http: HttpClient,
    private router: Router,
    private sideBarService: SidebarService,
    public topBarService: TopBarService,
    private store: Store<{}>,
    private _snackBar: MatSnackBar
  ) {}

  login(account_number: string, password: string, form: FormGroup) {
    this.http
      .post<{ message: string; userToken: string }>(
        environment.api + 'api/user/login',
        {
          account_number,
          password,
        }
      )
      .subscribe(
        (response) => {
          let userToken = response.userToken;
          if (userToken) {
            localStorage.setItem('user-token', userToken);
            this.router.navigate(['dashboard']);
            this.sideBarService.show();
            this.topBarService.show();
            this.resetStates();
          }
        },
        (error) => {
          form.setErrors({ incorrectAuth: true });
        }
      );
  }

  register(person: {
    username: string;
    password: string;
    first_name: string;
    last_name: string;
    birthdate: string;
    address: string;
    secret_code: string;
  }) {
    this.http
      .post<{ message: string; userToken: string }>(
        environment.api + 'api/user/register',
        person
      )
      .subscribe(
        (response) => {
          let userToken = response.userToken;

          this._snackBar.openFromComponent(SnackbarComponent, {
            duration: this.snackBarDuration * 1000,
            verticalPosition: 'top',
            horizontalPosition: 'center',
            panelClass: ['snackbar-background'],
            data: {
              message: response.message,
            },
          });

          if (userToken) {
            localStorage.setItem('user-token', userToken);
            this.router.navigate(['/']);
            this.sideBarService.show();
            this.resetStates();
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

  logout() {
    localStorage.removeItem('user-token');
    this.router.navigate(['/login']);
    this.resetStates();
  }

  fetchUserDetails() {
    this.http
      .get<{
        message: string;
        data: { user: UserState; user_verification: UserState };
      }>(environment.api + 'api/user/user-details', {
        headers: this.headers,
      })
      .subscribe((response) => {
        const data = response.data;
        if (data) {
          this.store.dispatch(setUserData({ user: data.user }));
          this.store.dispatch(setUserData({ user: data.user_verification }));
        }
      });
  }

  fetchUserData() {
    const helper = new JwtHelperService();
    const token = this.userToken;

    if (token) {
      const user = helper.decodeToken(token);

      this.store.dispatch(setUserData({ user }));
    }
  }

  updateUser(update_info: {
    old_password?: string;
    new_password?: string;
    first_name?: string;
    last_name?: string;
    birthdate?: string;
    address?: string;
    contact_number?: string;
  }) {
    this.http
      .post<{ message: string; userToken: string }>(
        environment.api + 'api/user/update-user',
        {
          update_info,
        },
        { headers: this.headers }
      )
      .subscribe(
        (response) => {
          const userToken = response.userToken;

          this._snackBar.openFromComponent(SnackbarComponent, {
            duration: this.snackBarDuration * 1000,
            verticalPosition: 'top',
            horizontalPosition: 'center',
            panelClass: ['snackbar-background'],
            data: {
              message: response.message,
            },
          });

          if (userToken) {
            localStorage.setItem('user-token', userToken);
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

  private resetStates() {
    this.store.dispatch(resetGenealogy());
    this.store.dispatch(resetUserData());
  }

  get userToken(): string | null {
    return localStorage.getItem('user-token');
  }

  get headers() {
    return { Authorization: 'Bearer ' + this.userToken };
  }

  get isLogin() {
    return this.userToken;
  }
}
