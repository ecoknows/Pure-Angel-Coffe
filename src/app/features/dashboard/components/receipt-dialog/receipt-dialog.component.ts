import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { WITHDRAWAL_CHARGE } from '@server/constants';

@Component({
  selector: 'app-receipt-dialog',
  templateUrl: './receipt-dialog.component.html',
  styleUrls: ['./receipt-dialog.component.sass'],
})
export class ReceiptDialogComponent {
  constructor(
    @Inject(MAT_DIALOG_DATA)
    public data: {
      amount: number;
      date: string;
      mode_of_withdrawal: string;
    }
  ) {}

  get withdrawalCharge() {
    return WITHDRAWAL_CHARGE;
  }

  get modeOfWithdrawal() {
    if (this.data.mode_of_withdrawal == 'gcash') {
      return 'G-Cash';
    }

    switch (this.data.mode_of_withdrawal) {
      case 'gcash':
        return 'G-Cash';
      case 'atm':
        return 'ATM';
      case 'check':
        return 'Check';
      case 'cash':
        return 'Cash';
    }

    return '';
  }
}
