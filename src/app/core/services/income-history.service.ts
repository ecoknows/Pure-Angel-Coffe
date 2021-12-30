import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import {
  setListIncomeHistory,
  resetListIncomeHistory,
} from '@core/redux/income-history/income-history.actions';
import { IncomeHistoryState } from '@core/redux/income-history/income-history.reducer';
import { environment } from '@env';
import { Store } from '@ngrx/store';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class IncomeHistoryService {
  snackBarDuration = 2;

  constructor(
    private http: HttpClient,
    private authService: AuthService,
    private _snackBar: MatSnackBar,
    private store: Store<{}>
  ) {}

  resetIncomeHistory() {
    this.store.dispatch(resetListIncomeHistory());
  }

  fetchCoffeeIncome() {
    this.http
      .get<{ message: string; data: IncomeHistoryState[] }>(
        environment.api + 'api/income-history/coffee-income',
        { headers: this.authService.headers }
      )
      .subscribe(
        (response) => {
          const data = response.data;

          if (data) {
            this.store.dispatch(setListIncomeHistory({ list: data }));
          }
        },
        (error) => {}
      );
  }

  fetchSoapIncome() {
    this.http
      .get<{ message: string; data: IncomeHistoryState[] }>(
        environment.api + 'api/income-history/soap-income',
        { headers: this.authService.headers }
      )
      .subscribe(
        (response) => {
          const data = response.data;

          if (data) {
            this.store.dispatch(setListIncomeHistory({ list: data }));
          }
        },
        (error) => {}
      );
  }

  fetchNewMemberIncome() {
    this.http
      .get<{ message: string; data: IncomeHistoryState[] }>(
        environment.api + 'api/income-history/new-member-income',
        { headers: this.authService.headers }
      )
      .subscribe(
        (response) => {
          const data = response.data;
          if (data) {
            this.store.dispatch(setListIncomeHistory({ list: data }));
          }
        },
        (error) => {}
      );
  }

  fetchAERebatesB1t1() {
    this.http
      .get<{ message: string; data: IncomeHistoryState[] }>(
        environment.api + 'api/income-history/ae-rebates-b1t1',
        { headers: this.authService.headers }
      )
      .subscribe(
        (response) => {
          const data = response.data;
          if (data) {
            console.log(data);

            this.store.dispatch(setListIncomeHistory({ list: data }));
          }
        },
        (error) => {}
      );
  }

  fetchAERebatesB2t3() {
    this.http
      .get<{ message: string; data: IncomeHistoryState[] }>(
        environment.api + 'api/income-history/ae-rebates-b2t3',
        { headers: this.authService.headers }
      )
      .subscribe(
        (response) => {
          const data = response.data;
          if (data) {
            this.store.dispatch(setListIncomeHistory({ list: data }));
          }
        },
        (error) => {}
      );
  }

  fetchDirectReferral() {
    this.http
      .get<{ message: string; data: IncomeHistoryState[] }>(
        environment.api + 'api/income-history/direct-referral',
        { headers: this.authService.headers }
      )
      .subscribe(
        (response) => {
          const data = response.data;
          if (data) {
            this.store.dispatch(setListIncomeHistory({ list: data }));
          }
        },
        (error) => {}
      );
  }

  fetchIndirectReferral() {
    this.http
      .get<{ message: string; data: IncomeHistoryState[] }>(
        environment.api + 'api/income-history/indirect-referral',
        { headers: this.authService.headers }
      )
      .subscribe(
        (response) => {
          const data = response.data;
          if (data) {
            this.store.dispatch(setListIncomeHistory({ list: data }));
          }
        },
        (error) => {}
      );
  }

  fetchPairingBonus() {
    this.http
      .get<{ message: string; data: IncomeHistoryState[] }>(
        environment.api + 'api/income-history/pairing-bonus',
        { headers: this.authService.headers }
      )
      .subscribe(
        (response) => {
          const data = response.data;
          if (data) {
            this.store.dispatch(setListIncomeHistory({ list: data }));
          }
        },
        (error) => {}
      );
  }

  fetchStockistEncodeNewOrderB1t1() {
    this.http
      .get<{ message: string; data: IncomeHistoryState[] }>(
        environment.api + 'api/income-history/stockist-new-order-b1t1',
        { headers: this.authService.headers }
      )
      .subscribe(
        (response) => {
          const data = response.data;
          if (data) {
            this.store.dispatch(setListIncomeHistory({ list: data }));
          }
        },
        (error) => {}
      );
  }

  fetchStockistEncodeNewOrderB2t3() {
    this.http
      .get<{ message: string; data: IncomeHistoryState[] }>(
        environment.api + 'api/income-history/stockist-new-order-b2t3',
        { headers: this.authService.headers }
      )
      .subscribe(
        (response) => {
          const data = response.data;
          if (data) {
            this.store.dispatch(setListIncomeHistory({ list: data }));
          }
        },
        (error) => {}
      );
  }

  fetchStockistRepeatPurchaseCoffee() {
    this.http
      .get<{ message: string; data: IncomeHistoryState[] }>(
        environment.api + 'api/income-history/stockist-repeat-purchase-coffee',
        { headers: this.authService.headers }
      )
      .subscribe(
        (response) => {
          const data = response.data;
          if (data) {
            this.store.dispatch(setListIncomeHistory({ list: data }));
          }
        },
        (error) => {}
      );
  }

  fetchStockistRepeatPurchaseSoap() {
    this.http
      .get<{ message: string; data: IncomeHistoryState[] }>(
        environment.api + 'api/income-history/stockist-repeat-purchase-soap',
        { headers: this.authService.headers }
      )
      .subscribe(
        (response) => {
          const data = response.data;
          if (data) {
            this.store.dispatch(setListIncomeHistory({ list: data }));
          }
        },
        (error) => {}
      );
  }

  fetchProductVoucher() {
    this.http
      .get<{ message: string; data: IncomeHistoryState[] }>(
        environment.api + 'api/income-history/product-voucher',
        { headers: this.authService.headers }
      )
      .subscribe(
        (response) => {
          const data = response.data;
          if (data) {
            this.store.dispatch(setListIncomeHistory({ list: data }));
          }
        },
        (error) => {}
      );
  }

  fetchTotalIncome() {
    this.http
      .get<{ message: string; data: IncomeHistoryState[] }>(
        environment.api + 'api/income-history/total-income',
        { headers: this.authService.headers }
      )
      .subscribe(
        (response) => {
          const data = response.data;
          if (data) {
            this.store.dispatch(setListIncomeHistory({ list: data }));
          }
        },
        (error) => {}
      );
  }

  fetchSearchTotalIncome(user_id: string | null) {
    this.http
      .post<{ message: string; data: IncomeHistoryState[] }>(
        environment.api + 'api/income-history/search-total-income',
        { user_id: user_id },
        { headers: this.authService.headers }
      )
      .subscribe(
        (response) => {
          const data = response.data;
          if (data) {
            this.store.dispatch(setListIncomeHistory({ list: data }));
          }
        },
        (error) => {}
      );
  }
}
