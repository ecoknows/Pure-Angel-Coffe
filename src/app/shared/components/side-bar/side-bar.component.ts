import { Component } from '@angular/core';
import {
  faDesktop,
  faBell,
  faUsers,
  faTree,
} from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-side-bar',
  templateUrl: './side-bar.component.html',
  styleUrls: ['./side-bar.component.sass'],
})
export class SideBarComponent {
  menus = [
    {
      url: '',
      icon: faDesktop,
    },
    {
      url: 'genealogy',
      icon: faTree,
    },
    {
      url: 'referrals',
      icon: faUsers,
    },
    {
      url: 'notifications',
      icon: faBell,
    },
  ];
}