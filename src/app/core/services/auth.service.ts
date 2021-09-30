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

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(
    private http: HttpClient,
    private router: Router,
    private sideBarService: SidebarService,
    private store: Store<{
      branchReducer: GenealogyState;
      userReducer: UserState;
    }>
  ) {}

  login(username: string, password: string) {
    this.http
      .post<{ message: string; userToken: string }>(
        environment.api + 'api/user/login',
        {
          username,
          password,
        }
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

  fetchUserData() {
    const helper = new JwtHelperService();
    const token = this.userToken;

    this.fetchUserIncome();

    if (token) {
      const user = helper.decodeToken(token);

      this.store.dispatch(setUserData({ user }));
    }
  }

  private fetchUserIncome() {
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
          data.overall_income =
            (data?.automatic_equivalent_rebates || 0) +
            (data?.direct_referral || 0) +
            (data?.indirect_referral || 0) +
            (data?.pairing_bonus || 0);

          this.store.dispatch(setUserData({ user: data }));
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
