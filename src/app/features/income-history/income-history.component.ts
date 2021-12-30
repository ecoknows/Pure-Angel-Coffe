import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { IncomeHistoryState } from '@core/redux/income-history/income-history.reducer';
import { UserState } from '@core/redux/user/user.reducer';
import { AuthService } from '@core/services/auth.service';
import { IncomeHistoryService } from '@core/services/income-history.service';
import { Store } from '@ngrx/store';
import { INCOME_CHARGE } from '@server/constants';
import { ColumnMode } from '@swimlane/ngx-datatable';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-income-history',
  templateUrl: './income-history.component.html',
  styleUrls: ['./income-history.component.sass'],
})
export class IncomeHistoryComponent implements OnInit {
  dataSource$: Observable<IncomeHistoryState[]>;
  user$: Observable<UserState>;
  ColumnMode = ColumnMode;

  title!: string | null;
  name!: string | null;
  account_number!: string | null;

  constructor(
    private route: ActivatedRoute,
    private incomeHistoryService: IncomeHistoryService,
    private authService: AuthService,
    private store: Store<{
      incomeHistoryReducer: IncomeHistoryState[];
      userReducer: UserState;
    }>
  ) {
    this.title = this.route.snapshot.queryParamMap.get('income');
    this.name = this.route.snapshot.queryParamMap.get('name');
    this.account_number =
      this.route.snapshot.queryParamMap.get('account_number');
    this.dataSource$ = this.store.select('incomeHistoryReducer');
    this.user$ = this.store.select('userReducer');
  }

  totalIncome(income: number) {
    const charge = income * INCOME_CHARGE;
    return income - charge;
  }

  incomeCharge(income: number) {
    return income * INCOME_CHARGE;
  }

  ngOnInit() {
    this.incomeHistoryService.resetIncomeHistory();
    switch (this.title) {
      case 'coffee-income':
        this.incomeHistoryService.fetchCoffeeIncome();
        break;
      case 'soap-income':
        this.incomeHistoryService.fetchSoapIncome();
        break;
      case 'new-member':
        this.incomeHistoryService.fetchNewMemberIncome();
        break;
      case 'ae-rebates-b1t1':
        this.incomeHistoryService.fetchAERebatesB1t1();
        break;
      case 'ae-rebates-b2t3':
        this.incomeHistoryService.fetchAERebatesB2t3();
        break;
      case 'direct-referral':
        this.incomeHistoryService.fetchDirectReferral();
        break;
      case 'indirect-referral':
        this.incomeHistoryService.fetchIndirectReferral();
        break;
      case 'pairing-bonus':
        this.incomeHistoryService.fetchPairingBonus();
        break;
      case 'stockist-new-order-b1t1':
        this.incomeHistoryService.fetchStockistEncodeNewOrderB1t1();
        break;
      case 'stockist-new-order-b2t3':
        this.incomeHistoryService.fetchStockistEncodeNewOrderB2t3();
        break;
      case 'stockist-repeat-purchase-coffee':
        this.incomeHistoryService.fetchStockistRepeatPurchaseCoffee();
        break;
      case 'stockist-repeat-purchase-soap':
        this.incomeHistoryService.fetchStockistRepeatPurchaseSoap();
        break;
      case 'product-voucher':
        this.incomeHistoryService.fetchProductVoucher();
        break;
      case 'total-income':
        this.incomeHistoryService.fetchTotalIncome();
        break;
      case 'search-total-income':
        const user_id: string | null =
          this.route.snapshot.queryParamMap.get('user_id');
        this.incomeHistoryService.fetchSearchTotalIncome(user_id);
        break;
      case 'unclaimed-income':
        this.incomeHistoryService.fetchTotalIncome();
        this.authService.fetchUserDetails();
        break;
    }
  }
}
