import { NgModule } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { RouterModule } from '@angular/router';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { CreateDialogComponent } from './components/create-dialog/create-dialog.component';
import { MatTabsModule } from '@angular/material/tabs';
import { MatInputModule } from '@angular/material/input';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { ReactiveFormsModule } from '@angular/forms';
import { SnackbarComponent } from './components/snackbar/snackbar.component';
import { TopBarComponent } from './components/top-bar/top-bar.component';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { SearchComponent } from './components/search/search.component';
import { MatSidenavModule } from '@angular/material/sidenav';

@NgModule({
  declarations: [
    CreateDialogComponent,
    SnackbarComponent,
    TopBarComponent,
    SearchComponent,
  ],
  imports: [
    FontAwesomeModule,
    BrowserAnimationsModule,
    RouterModule,
    NgxDatatableModule,
    MatInputModule,
    MatTabsModule,
    MatDialogModule,
    MatButtonModule,
    MatDatepickerModule,
    MatNativeDateModule,
    ReactiveFormsModule,
    MatToolbarModule,
    MatIconModule,
    MatSidenavModule,
  ],
  exports: [TopBarComponent, MatToolbarModule, MatIconModule, MatSidenavModule],
})
export class SharedModule {}
