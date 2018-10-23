import { ExtraOptions, RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { AuthGuard } from './common/http/services/auth-guard.service';
import {
  NbAuthComponent,
  NbLoginComponent,
  NbLogoutComponent,
  NbRegisterComponent,
  NbChangePasswordComponent,
  NbForgotPasswordComponent,
} from './auth';

const routes: Routes = [
  { path: 'pages', canActivate: [AuthGuard], loadChildren: 'app/pages/pages.module#PagesModule' },
  {
    path: 'auth',
    component: NbAuthComponent,
    children: [
      {
        path: '',
        component: NbLoginComponent,
      },
      {
        path: 'login',
        component: NbLoginComponent,
      },
      {
        path: 'logout',
        component: NbLogoutComponent,
        canActivate: [AuthGuard],
      },
      {
        path: 'change-password',
        component: NbChangePasswordComponent,
        canActivate: [AuthGuard],
      },
      {
        path: 'forgot-password',
        component: NbForgotPasswordComponent,

      },
    ],
  },
  { path: '', redirectTo: 'pages', pathMatch: 'full' },
];

const config: ExtraOptions = {
  useHash: true,
};

@NgModule({
  imports: [RouterModule.forRoot(routes, config)],
  exports: [RouterModule],
})
export class AppRoutingModule {
}
