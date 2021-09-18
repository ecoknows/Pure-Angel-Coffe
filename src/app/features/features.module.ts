import { NgModule } from '@angular/core';
import {
  DashboardComponent,
  GenealogyComponent,
  LoginComponent,
  NotificationsComponent,
  ReferralsComponent,
} from '.';

import { NgxChartsModule } from '@swimlane/ngx-charts';

import { MatTabsModule } from '@angular/material/tabs';
import { MatInputModule } from '@angular/material/input';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { RouterModule } from '@angular/router';
import { DirectSellingComponent } from './referrals/components/direct-selling/direct-selling.component';
import { SharedModule } from '@shared/shared.module';
import { GenealogyChartComponent } from './genealogy/components/genealogy-chart/genealogy-chart.component';
import { GenealogyDesignerComponent } from './genealogy/components/genealogy-designer/genealogy-designer.component';
import { GenealogyNodeComponent } from './genealogy/components/genealogy-node/genealogy-node.component';
import { LineChartComponent } from './dashboard/components/line-chart/line-chart.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    DashboardComponent,
    LoginComponent,
    NotificationsComponent,
    ReferralsComponent,
    DirectSellingComponent,
    GenealogyChartComponent,
    GenealogyDesignerComponent,
    GenealogyNodeComponent,
    GenealogyComponent,
    LineChartComponent,
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
  ],
})
export class FeaturesModule {}