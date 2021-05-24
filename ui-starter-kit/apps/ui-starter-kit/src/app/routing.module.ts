import { Route } from '@angular/router'
import { LoginComponent, PasswordChangeComponent, BiqAuthGuard } from '@biq/login-mgmt'
import { HomeComponent } from './home/home.component'

export enum ROUTE_PATHS {
  HOME = 'home',
  LOGIN = 'login',
  PASSWORD_CHANGE = 'passwordchange',
  FORGOT_PASSWORD = 'forgotpassword',
  NOT_FOUND_404 = '**'
}

export const ValidLoginRedirectRoute = ROUTE_PATHS.HOME

export const rootRoutes: Route[] = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: ROUTE_PATHS.HOME
  },
  {
    path: ROUTE_PATHS.HOME,
    canActivate: [BiqAuthGuard],
    component: HomeComponent
  },
  {
    path: ROUTE_PATHS.LOGIN,
    component: LoginComponent
  },
  {
    path: ROUTE_PATHS.PASSWORD_CHANGE,
    component: PasswordChangeComponent
  }
]
