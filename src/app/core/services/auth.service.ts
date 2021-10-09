import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { UserState } from '@core/redux/user/user.reducer';
import { Store } from '@ngrx/store';
import { resetUserData, setUserData } from '@core/redux/user/user.actions';
import { SidebarService } from './sidebar.service';
import { GenealogyState } from '@core/redux/genealogy/genealogy.reducer';
import { resetGenealogy } from '@core/redux/genealogy/genealogy.actions';
import { Observable } from 'rxjs';
import { JwtHelperService } from '@auth0/angular-jwt';
import { environment } from '@env';
import { FormGroup } from '@angular/forms';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(
    private http: HttpClient,
    private router: Router,
    private sideBarService: SidebarService,
    private store: Store<{}>
  ) {}

  login(username: string, password: string, form: FormGroup) {
    this.http
      .post<{ message: string; userToken: string }>(
        environment.api + 'api/user/login',
        {
          username,
          password,
        }
      )
      .subscribe(
        (response) => {
          let userToken = response.userToken;
          if (userToken) {
            localStorage.setItem('user-token', userToken);
            this.router.navigate(['/']);
            this.sideBarService.show();
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
      .subscribe((response) => {
        let userToken = response.userToken;
        if (userToken) {
          localStorage.setItem('user-token', userToken);
          this.router.navigate(['/']);
          this.sideBarService.show();
          this.resetStates();
        }
      });
  }

  logout() {
    localStorage.removeItem('user-token');
    this.router.navigate(['/login']);
    this.resetStates();
  }

  fetchUserIncome() {
    const helper = new JwtHelperService();
    const token = this.userToken;

    this.fetchIncome();

    if (token) {
      const user = helper.decodeToken(token);

      this.store.dispatch(setUserData({ user }));
    }
  }

  fetchUserDetails() {
    this.http
      .get<{ message: string; data: UserState }>(
        environment.api + 'api/user/user-details',
        {
          headers: this.headers,
        }
      )
      .subscribe((response) => {
        const data = response.data;
        if (data) {
          this.store.dispatch(setUserData({ user: data }));
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

  fetchIncome() {
    this.http
      .get<{ message: string; data: UserState }>(
        environment.api + 'api/user/income',
        {
          headers: this.headers,
        }
      )
      .subscribe((response) => {
        const data = response.data;
        if (data) {
          this.store.dispatch(setUserData({ user: data }));
        }
      });
  }

  updateUser(update_info: {
    username?: string;
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
      .subscribe((response) => {
        const userToken = response.userToken;

        if (userToken) {
          localStorage.setItem('user-token', userToken);
        }
      });
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
