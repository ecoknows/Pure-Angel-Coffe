import { Component, Input } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { SearchComponent } from '../search/search.component';

@Component({
  selector: 'app-top-bar',
  templateUrl: './top-bar.component.html',
  styleUrls: ['./top-bar.component.sass'],
})
export class TopBarComponent {
  @Input('drawer') drawer: any;

  constructor(private dialog: MatDialog) {}

  viewAccount() {
    this.dialog.open(SearchComponent);
  }
}
