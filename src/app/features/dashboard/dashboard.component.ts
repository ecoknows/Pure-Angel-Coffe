import { Component, OnInit } from '@angular/core';
import { UserState } from '@core/redux/user/user.reducer';
import { AuthService } from '@core/services/auth.service';
import { GenealogyService } from '@core/services/genealogy.service';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { CashoutDialogComponent } from './components/cashout-dialog/cashout-dialog.component';
import { Router } from '@angular/router';
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.sass'],
})
export class DashboardComponent implements OnInit {
  user$: Observable<UserState>;

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
}
