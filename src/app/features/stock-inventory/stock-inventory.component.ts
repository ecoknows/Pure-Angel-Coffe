import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { UserState } from '@core/redux/user/user.reducer';
import { AuthService } from '@core/services/auth.service';
import { StockInventoryService } from '@core/services/stock-inventory.service';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-stock-inventory',
  templateUrl: './stock-inventory.component.html',
  styleUrls: ['./stock-inventory.component.sass'],
})
export class StockInventoryComponent implements OnInit {
  user$: Observable<UserState>;

  form: FormGroup;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private stockInventoryService: StockInventoryService,
    private store: Store<{ userReducer: UserState }>
  ) {
    this.user$ = this.store.select('userReducer');
    this.form = this.fb.group({
      stock_coffee_b1t1: [undefined],
      stock_soap_b1t1: [undefined],
      stock_coffee_b2t3: [undefined],
      stock_soap_b2t3: [undefined],
    });
  }

  ngOnInit(): void {
    this.authService.fetchUserDetails();
  }

  restock() {
    const stock_coffee_b1t1 = this.form.get('stock_coffee_b1t1')?.value;
    const stock_soap_b1t1 = this.form.get('stock_soap_b1t1')?.value;
    const stock_coffee_b2t3 = this.form.get('stock_coffee_b2t3')?.value;
    const stock_soap_b2t3 = this.form.get('stock_soap_b2t3')?.value;
    this.stockInventoryService.restock({
      stock_coffee_b1t1,
      stock_soap_b1t1,
      stock_coffee_b2t3,
      stock_soap_b2t3,
    });
  }
}
