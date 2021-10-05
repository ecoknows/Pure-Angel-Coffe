import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { UserState } from '@core/redux/user/user.reducer';
import { AuthService } from '@core/services/auth.service';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-setting',
  templateUrl: './setting.component.html',
  styleUrls: ['./setting.component.sass'],
})
export class SettingComponent implements OnInit {
  form: FormGroup;
  user$: Observable<UserState>;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private store: Store<{ userReducer: UserState }>
  ) {
    this.form = fb.group({
      username: [''],
      old_password: [''],
      new_password: [''],
      first_name: [''],
      last_name: [''],
      birthdate: [''],
      address: [''],
      contact_number: [''],
    });
    this.user$ = this.store.select('userReducer');
  }

  ngOnInit(): void {
    this.authService.fetchUserData();
  }

  submit() {}
}
