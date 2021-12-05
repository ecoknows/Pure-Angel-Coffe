import { Component, Input } from '@angular/core';
import { HomeTopBarService } from '@core/services/home-top-bar.service';
import { SidebarService } from '@core/services/sidebar.service';
import { TopBarService } from '@core/services/top-bar.service';

@Component({
  selector: 'app-home-side-bar',
  templateUrl: './home-side-bar.component.html',
  styleUrls: ['./home-side-bar.component.sass'],
})
export class HomeSideBarComponent {
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
