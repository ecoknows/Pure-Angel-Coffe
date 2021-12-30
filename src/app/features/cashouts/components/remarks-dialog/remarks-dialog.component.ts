import { Component, OnInit, Inject } from '@angular/core';
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import { CashoutsState } from '@core/redux/cashouts/cashouts.reducer';
import { CashoutsComponent } from '@features/cashouts/cashouts.component';

@Component({
  selector: 'app-remarks-dialog',
  templateUrl: './remarks-dialog.component.html',
  styleUrls: ['./remarks-dialog.component.sass'],
})
export class RemarksDialogComponent implements OnInit {
  remark?: string;

  constructor(
    public dialogRef: MatDialogRef<CashoutsComponent>,
    @Inject(MAT_DIALOG_DATA)
    public data: {
      cashout: CashoutsState;
    }
  ) {}

  ngOnInit(): void {}

  cancel(): void {
    this.dialogRef.close();
  }

  modeOfWithdrawal(mode: string | undefined) {
    if (mode == 'gcash') {
      return 'G-Cash';
    }

    switch (mode) {
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
