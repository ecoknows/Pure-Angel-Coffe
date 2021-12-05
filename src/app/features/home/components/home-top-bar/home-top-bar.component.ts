import { Component, Input } from '@angular/core';
import { HomeTopBarService } from '@core/services/home-top-bar.service';
import { SidebarService } from '@core/services/sidebar.service';
import { TopBarService } from '@core/services/top-bar.service';

@Component({
  selector: 'app-home-top-bar',
  templateUrl: './home-top-bar.component.html',
  styleUrls: ['./home-top-bar.component.sass'],
})
export class HomeTopBarComponent {
  @Input('drawer') drawer: any;

  constructor(
    private sideBarService: SidebarService,
    public topBarService: TopBarService,
    private homeTopBarService: HomeTopBarService
  ) {}

  closeHomeTopBar() {
    this.homeTopBarService.hide();
    this.sideBarService.show();
    this.topBarService.show();
  }
}
