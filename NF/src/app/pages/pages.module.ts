import { NgModule } from '@angular/core';
import { PagesComponent } from './pages.component';
import { DashboardModule } from './dashboard/dashboard.module';
import { PagesRoutingModule } from './pages-routing.module';
import { ThemeModule } from '../@theme/theme.module';

import { AuthGuard } from './../common/http/services/auth-guard.service';
import { RoleGuard } from './../common/http/services/role-guard.service';
import { HttpClientService } from '../common/http/services/httpclient.service';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { AuthInspector } from '../common/http/services/auth.interceptor';


const PAGES_COMPONENTS = [
  PagesComponent,
  
];
      // SVN TEST   
@NgModule({
  imports: [
    PagesRoutingModule,
    ThemeModule,
    DashboardModule,
    HttpClientModule,
  ],
  declarations: [
    ...PAGES_COMPONENTS,
  ],
  providers: [
    AuthGuard,
    RoleGuard,
    HttpClientService,
    
    {provide: HTTP_INTERCEPTORS,useClass:AuthInspector, multi:true},
  ],
})
export class PagesModule {

}
