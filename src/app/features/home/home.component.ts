import { Component, OnInit } from '@angular/core';
import { HomeTopBarService } from '@core/services/home-top-bar.service';
import { SidebarService } from '@core/services/sidebar.service';
import { TopBarService } from '@core/services/top-bar.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.sass'],
})
export class HomeComponent {
  constructor(
    private sideBarService: SidebarService,
    private topBarService: TopBarService,
    private homeTopBarService: HomeTopBarService
  ) {
    // HIDE ALL
    this.sideBarService.hide();
    this.topBarService.hide();
    this.homeTopBarService.show();
  }
}
