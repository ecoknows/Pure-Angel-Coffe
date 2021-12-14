import { DashboardComponent } from './dashboard/dashboard.component';
import { HomeComponent } from './home/home.component';
import { GenealogyComponent } from './genealogy/genealogy.component';
import { LoginComponent } from './login/login.component';
import { NotificationsComponent } from './notifications/notifications.component';
import { IncomeHistoryComponent } from './income-history/income-history.component';
import { CashoutsComponent } from './cashouts/cashouts.component';

export const components: any[] = [
  HomeComponent,
  DashboardComponent,
  LoginComponent,
  NotificationsComponent,
  GenealogyComponent,
  IncomeHistoryComponent,
  CashoutsComponent,
];

export * from './home/home.component';
export * from './dashboard/dashboard.component';
export * from './login/login.component';
export * from './notifications/notifications.component';
export * from './genealogy/genealogy.component';
export * from './setting/setting.component';
export * from './income-history/income-history.component';
export * from './cashouts/cashouts.component';
