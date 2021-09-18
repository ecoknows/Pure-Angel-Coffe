import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from '@core/services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuardService implements CanActivate {

  constructor(private authService: AuthService, private router: Router) { }


  canActivate(){
    if(this.authService.userToken){
      return true;
    }
    this.router.navigate(['/login']);
    return false;
  }
}