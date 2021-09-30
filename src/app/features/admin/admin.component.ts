import { Component, OnInit } from '@angular/core';
import { UsersTableState } from '@core/redux/admin/users-table.reducers';
import { AuthService } from '@core/services/auth.service';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { AdminService } from './services/admin.service';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.sass'],
})
export class AdminComponent implements OnInit {
  usersTable$: Observable<UsersTableState[]>;

  constructor(
    private authService: AuthService,
    private adminService: AdminService,
    private store: Store<{ usersTableReducer: UsersTableState[] }>
  ) {
    this.usersTable$ = this.store.select('usersTableReducer');
  }

  ngOnInit(): void {
    this.authService.fetchUserData();
    this.adminService.fetchUsersTable();
  }
}
