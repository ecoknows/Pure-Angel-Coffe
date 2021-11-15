import { DashboardComponent } from './dashboard/dashboard.component';
import { GenealogyComponent } from './genealogy/genealogy.component';
import { LoginComponent } from './login/login.component';
import { NotificationsComponent } from './notifications/notifications.component';
import { IncomeHistoryComponent } from './income-history/income-history.component';

export const components: any[] = [
  DashboardComponent,
  LoginComponent,
  NotificationsComponent,
  GenealogyComponent,
  IncomeHistoryComponent,
];

export * from './dashboard/dashboard.component';
export * from './login/login.component';
export * from './notifications/notifications.component';
export * from './genealogy/genealogy.component';
export * from './setting/setting.component';
export * from './income-history/income-history.component';
