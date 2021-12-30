import { Component, OnInit } from '@angular/core';
import { UserState } from '@core/redux/user/user.reducer';
import { AuthService } from '@core/services/auth.service';
import { GenealogyService } from '@core/services/genealogy.service';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { CashoutDialogComponent } from './components/cashout-dialog/cashout-dialog.component';
import {
  faHandHoldingUsd,
  faClipboardList,
} from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.sass'],
})
export class DashboardComponent implements OnInit {
  user$: Observable<UserState>;

  faHandHoldingUsd = faHandHoldingUsd;
  faClipboardList = faClipboardList;

  constructor(
    private authService: AuthService,
    private genealogyService: GenealogyService,
    private store: Store<{ userReducer: UserState }>,
    public dialog: MatDialog
  ) {
    this.user$ = this.store.select('userReducer');
  }

  ngOnInit(): void {
    this.authService.fetchUserDetails();
    this.genealogyService.fetchGenealogy();
  }

  cashout() {
    this.dialog.open(CashoutDialogComponent);
  }

  totalInventory(user: UserState | null) {
    let coffee_income = 0;
    let soap_income = 0;
    if (user?.inventory && user?.inventory?.coffee_income) {
      coffee_income = user?.inventory?.coffee_income;
    }
    if (user?.inventory && user?.inventory?.soap_income) {
      soap_income = user?.inventory?.soap_income;
    }

    return coffee_income + soap_income;
  }

  isMegaAdminStock(user: UserState | null) {
    if (user?.is_admin || user?.is_mega_center || user?.is_stockist) {
      return true;
    }
    return false;
  }

  getUserRole(user: UserState | null) {
    if (user?.is_admin) {
      return 'Admin';
    }

    if (user?.is_mega_center) {
      return 'Mega Center';
    }

    if (user?.is_stockist) {
      return 'Stockist';
    }

    return 'Member';
  }
  getClassUserRole(user: UserState | null) {
    if (user?.is_admin) {
      return 'admin';
    }

    if (user?.is_mega_center) {
      return 'mega-center';
    }

    if (user?.is_stockist) {
      return 'stockist';
    }

    return 'member';
  }

  b1t1SetConverter(quantity: number | undefined) {
    if (quantity) {
      return quantity / 2;
    }

    return 0;
  }

  b2t3SetConverter(quantity: number | undefined) {
    if (quantity) {
      return quantity / 5;
    }

    return 0;
  }
}
