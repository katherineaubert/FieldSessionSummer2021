import { BrowserModule, DomSanitizer } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { LocationStrategy, PathLocationStrategy } from '@angular/common';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatIconRegistry } from '@angular/material/icon';
import { RouterModule } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { BiqFiltersModule } from '@biq/filters';
import { BiqCommonModule, MaterialModule } from '@biq/common';
import { HttpClientModule } from '@angular/common/http';
import { StoreModule } from '@ngrx/store';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { EffectsModule } from '@ngrx/effects';
import { NgxWebstorageModule } from 'ngx-webstorage';
import { BiqUtilityModule } from '@biq/utility';
import { BiqAuthModule, API_ROOT } from '@biq/auth';
import { BiqLoginMgmtModule } from '@biq/login-mgmt';

import { environment } from '../environments/environment';
import { AppComponent } from './app.component';
import { ValidLoginRedirectRoute, rootRoutes, ROUTE_PATHS } from './routing.module';
import { HomeComponent } from './home/home.component';

const webStoragePrefix = 'biq'

@NgModule({
  declarations: [AppComponent, HomeComponent],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    MaterialModule,
    FlexLayoutModule,
    StoreModule.forRoot({}, {
      runtimeChecks: {
        strictStateImmutability: false,
        strictActionImmutability: false,
        strictStateSerializability: false,
        strictActionSerializability: false,
      },
    }),
    EffectsModule.forRoot([]),
    NgxWebstorageModule.forRoot({ prefix: webStoragePrefix }),
    RouterModule.forRoot(rootRoutes, { initialNavigation: 'enabled' }),
    !environment.production ? StoreDevtoolsModule.instrument() : [],
    BiqUtilityModule,
    BiqCommonModule,
    BiqFiltersModule.forRoot({
      filterApiRoot: environment.apiRoot,
      rawFilterSet: []
    }),
    BiqAuthModule.forRoot({
      failedAuthRedirect: ROUTE_PATHS.LOGIN,
      webStoragePrefix: webStoragePrefix,
      storageKeyNames: {
        currentDataAccessRole: 'currentDataAccessRole',
        jwtToken: 'token',
        domain: 'domain',
        userData: 'userData',
        selectableDataAccessRoles: 'selectableDataAccessRoles',
        userEmail: 'userEmail'
      }
    }),
    BiqLoginMgmtModule.forRoot({
      logoUrlLogin: 'assets/demo/customer_login.png',
      successfulLoginRoutePath: ValidLoginRedirectRoute,
      requestPasswordChangePath: ROUTE_PATHS.FORGOT_PASSWORD,
      loginTerms: 'You must agree to these... Very important things to abide by...'
    })
  ],
  providers: [
    CookieService,
    Location,
    {
      provide: API_ROOT,
      useValue: environment.apiRoot
    },
    {
      provide: LocationStrategy,
      useClass: PathLocationStrategy
    },
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
  constructor(matIconRegistry: MatIconRegistry, domSanitizer: DomSanitizer) {
    matIconRegistry.addSvgIconSet(domSanitizer.bypassSecurityTrustResourceUrl('./assets/mdi.svg'))
  }
}
