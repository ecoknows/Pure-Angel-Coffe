import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class HomeTopBarService {
  visibility: boolean = false;

  hide() {
    this.visibility = false;
  }

  show() {
    this.visibility = true;
  }
}
