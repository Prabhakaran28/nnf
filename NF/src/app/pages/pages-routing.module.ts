import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';

import { PagesComponent } from './pages.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { AuthGuard } from './../common/http/services/auth-guard.service';
import { RoleGuard } from './../common/http/services/role-guard.service';

const routes: Routes = [{
  path: '',
  canActivate: [AuthGuard], 
  component: PagesComponent,
  children: [
    {
      path: 'dashboard',
      canActivate: [AuthGuard], 
      component: DashboardComponent,
    },
    {
      path: '',
      canActivate: [AuthGuard], 
      redirectTo: 'dashboard',
      pathMatch: 'full',
    },
     {
      path: 'system',
      canActivate: [AuthGuard], 
      loadChildren: './system/system.module#SystemModule',
    }, 
    {
      path: 'hrms',
      loadChildren: './hrms/hrms.module#HrmsModule',
      canActivate: [AuthGuard], 
    },
    {
      path: 'seo',
      loadChildren: './seo/seo.module#SeoModule',
      canActivate: [AuthGuard], 
    },
  ],
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PagesRoutingModule {
}
