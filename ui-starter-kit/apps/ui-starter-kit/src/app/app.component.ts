import { Component, ViewChild } from '@angular/core';
import { BiqAuthService } from '@biq/auth';
import { MatDrawer } from '@angular/material/sidenav';
import { ROUTE_PATHS } from './routing.module';

@Component({
  selector: 'biq-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  @ViewChild('navDrawer') public navDrawer: MatDrawer

  public changePassConfig = {
    route: ROUTE_PATHS.PASSWORD_CHANGE,
    icon: 'key',
    title: 'Change Password'
  }

  public logoutConfig = {
    route: 'login',
    icon: 'logout',
    title: 'Logout'
  }

  constructor(private authSrvs: BiqAuthService) {

  }

  public logout() {
    this.navDrawer.close()
    this.authSrvs.logout()
  }
}
