import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PageNotFoundComponent } from '@core/components/page-not-found/page-not-found.component';
import { AuthGuardService } from '@core/guards/auth-guard.service';
import { LoginGuardService } from '@core/guards/login-guard.service';
import { AuthService } from '@core/services/auth.service';
import { MegaStockAdminGuardService } from '@core/services/mega-stock-admin-guard.service';
import { AdminComponent } from '@features/admin/admin.component';
import { CreateNewPinComponent } from '@features/admin/components/create-new-pin/create-new-pin.component';
import { PinHistoryComponent } from '@features/admin/components/create-new-pin/components/pin-history/pin-history.component';
import { UpgradeAccountComponent } from '@features/admin/components/upgrade-account/upgrade-account.component';
import { AdminGuardService } from '@features/admin/services/admin-guard.service';
import { GivePinStockistComponent } from '@features/mega-center/components/give-pin-stockist/give-pin-stockist.component';
import { MegaCenterComponent } from '@features/mega-center/mega-center.component';
import { MegaCenterGuardService } from '@features/mega-center/services/mega-center-guard.service';
import { NewMemberComponent } from '@features/new-member/new-member.component';
import { NewOrderComponent } from '@features/new-order/new-order.component';
import { StockInventoryComponent } from '@features/stock-inventory/stock-inventory.component';
import { HomeComponent } from '@features/home/home.component';

import {
  DashboardComponent,
  LoginComponent,
  NotificationsComponent,
  GenealogyComponent,
  SettingComponent,
  IncomeHistoryComponent,
  CashoutsComponent,
} from './features';

const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
  },
  {
    path: 'dashboard',
    component: DashboardComponent,
    canActivate: [AuthGuardService],
  },
  {
    path: 'dashboard/cashouts',
    component: CashoutsComponent,
    canActivate: [AuthGuardService],
  },
  {
    path: 'dashboard/incomes',
    component: IncomeHistoryComponent,
    canActivate: [AuthGuardService],
  },
  {
    path: 'login',
    component: LoginComponent,
    canActivate: [LoginGuardService],
  },
  {
    path: 'genealogy',
    component: GenealogyComponent,
    canActivate: [AuthGuardService],
  },
  {
    path: 'setting',
    component: SettingComponent,
    canActivate: [AuthGuardService],
  },
  {
    path: 'admin',
    component: AdminComponent,
    canActivate: [AdminGuardService],
  },
  {
    path: 'admin/create-new-pin',
    component: CreateNewPinComponent,
    canActivate: [AdminGuardService],
  },
  {
    path: 'admin/create-new-pin/pin-history',
    component: PinHistoryComponent,
    canActivate: [AdminGuardService],
  },
  {
    path: 'admin/upgrade-account',
    component: UpgradeAccountComponent,
    canActivate: [AdminGuardService],
  },
  {
    path: 'mega-center',
    component: MegaCenterComponent,
    canActivate: [MegaCenterGuardService],
  },
  {
    path: 'mega-center/give-pin-to-stockist',
    component: GivePinStockistComponent,
    canActivate: [MegaCenterGuardService],
  },
  {
    path: 'mega-center/give-pin-to-stockist/pin-history',
    component: PinHistoryComponent,
    canActivate: [MegaCenterGuardService],
  },
  {
    path: 'new-member',
    component: NewMemberComponent,
    canActivate: [MegaStockAdminGuardService],
  },
  {
    path: 'new-order',
    component: NewOrderComponent,
    canActivate: [MegaStockAdminGuardService],
  },
  {
    path: 'stock-inventory',
    component: StockInventoryComponent,
    canActivate: [MegaStockAdminGuardService],
  },
  {
    path: '**',
    component: PageNotFoundComponent,
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
