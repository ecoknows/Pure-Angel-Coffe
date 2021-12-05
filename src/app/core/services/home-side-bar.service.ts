import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class HomeSideBarService {
  visibility: boolean = true;
  buttonShow: any;

  hide() {
    this.visibility = false;
  }

  show() {
    this.visibility = true;
  }
}
