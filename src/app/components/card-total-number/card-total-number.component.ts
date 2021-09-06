import { Component, Input, OnInit } from '@angular/core';
import { faUsers } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-card-total-number',
  templateUrl: './card-total-number.component.html',
  styleUrls: ['./card-total-number.component.sass'],
})
export class CardTotalNumberComponent implements OnInit {
  @Input('money') money: number = 0;
  @Input('label') label: string = '';
  @Input('icon') icon: any = '';

  constructor() {}

  ngOnInit(): void {
    switch (this.icon) {
      case 'faUsers':
        this.icon = faUsers;
        break;
    }
  }
}
