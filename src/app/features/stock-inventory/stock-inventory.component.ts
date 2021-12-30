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
      restock_coffee: [0],
      restock_soap: [0],
    });
  }

  ngOnInit(): void {
    this.authService.fetchUserDetails();
  }

  restock() {
    const restock_coffee = this.form.get('restock_coffee')?.value;
    const restock_soap = this.form.get('restock_soap')?.value;
    this.stockInventoryService.restock({
      restock_coffee,
      restock_soap,
    });
  }

  b1t1SetConverter(quantity: number | undefined) {
    if (quantity) {
      return quantity / 2;
    }

    return 0;
  }

  b2t3SetConverter(quantity: number | undefined) {
    if (quantity) {
      return quantity / 5;
    }

    return 0;
  }
}
