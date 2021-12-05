import { NgModule } from '@angular/core';
import {
  DashboardComponent,
  GenealogyComponent,
  LoginComponent,
  NotificationsComponent,
} from '.';

import { NgxChartsModule } from '@swimlane/ngx-charts';

import { MatTabsModule } from '@angular/material/tabs';
import { MatInputModule } from '@angular/material/input';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { RouterModule } from '@angular/router';
import { SharedModule } from '@shared/shared.module';
import { GenealogyChartComponent } from './genealogy/components/genealogy-chart/genealogy-chart.component';
import { GenealogyDesignerComponent } from './genealogy/components/genealogy-designer/genealogy-designer.component';
import { GenealogyNodeComponent } from './genealogy/components/genealogy-node/genealogy-node.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDividerModule } from '@angular/material/divider';
import { MatStepperModule } from '@angular/material/stepper';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { GenealogyAddComponent } from './genealogy/components/genealogy-add/genealogy-add.component';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { AdminComponent } from './admin/admin.component';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { CashoutDialogComponent } from './dashboard/components/cashout-dialog/cashout-dialog.component';
import { SettingComponent } from './setting/setting.component';
import { MatSelectModule } from '@angular/material/select';
import { FormDirective } from './setting/directives/form.directive';
import { MatIconModule } from '@angular/material/icon';
import { MegaCenterComponent } from './mega-center/mega-center.component';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { NewMemberComponent } from './new-member/new-member.component';
import { NewOrderComponent } from './new-order/new-order.component';
import { MatListModule } from '@angular/material/list';
import { CreateNewPinComponent } from './admin/components/create-new-pin/create-new-pin.component';
import { MatRippleModule } from '@angular/material/core';
import { StockInventoryComponent } from './stock-inventory/stock-inventory.component';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { UpgradeAccountComponent } from './admin/components/upgrade-account/upgrade-account.component';
import { IncomeHistoryComponent } from './income-history/income-history.component';
import { BuyerInfoComponent } from './new-order/components/buyer-info/buyer-info.component';
import { ReferralInfoComponent } from './new-order/components/referral-info/referral-info.component';
import { SellerInfoComponent } from './new-order/components/seller-info/seller-info.component';
import { MegaCenterInfoComponent } from './new-order/components/mega-center-info/mega-center-info.component';
import { MatTableModule } from '@angular/material/table';
import { GivePinStockistComponent } from './mega-center/components/give-pin-stockist/give-pin-stockist.component';
import { PinHistoryComponent } from './admin/components/create-new-pin/components/pin-history/pin-history.component';
import { HomeComponent } from './home/home.component';
import { HomeTopBarComponent } from './home/components/home-top-bar/home-top-bar.component';
import { HomeSideBarComponent } from './home/components/home-side-bar/home-side-bar.component';

@NgModule({
  declarations: [
    DashboardComponent,
    LoginComponent,
    NotificationsComponent,
    GenealogyChartComponent,
    GenealogyDesignerComponent,
    GenealogyNodeComponent,
    GenealogyComponent,
    GenealogyAddComponent,
    AdminComponent,
    SettingComponent,
    FormDirective,
    MegaCenterComponent,
    NewMemberComponent,
    NewOrderComponent,
    CreateNewPinComponent,
    StockInventoryComponent,
    UpgradeAccountComponent,
    CashoutDialogComponent,
    IncomeHistoryComponent,
    BuyerInfoComponent,
    ReferralInfoComponent,
    SellerInfoComponent,
    MegaCenterInfoComponent,
    GivePinStockistComponent,
    PinHistoryComponent,
    HomeComponent,
    HomeTopBarComponent,
    HomeSideBarComponent,
  ],
  imports: [
    NgxChartsModule,

    MatTabsModule,
    MatInputModule,
    MatDialogModule,
    MatButtonModule,
    RouterModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule,
    MatDividerModule,
    MatListModule,
    MatStepperModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatSelectModule,
    FontAwesomeModule,
    NgxDatatableModule,
    MatCheckboxModule,
    MatIconModule,
    MatSnackBarModule,
    MatRippleModule,
    MatButtonToggleModule,
    MatTableModule,
  ],
  exports: [HomeTopBarComponent, HomeSideBarComponent],
})
export class FeaturesModule {}
