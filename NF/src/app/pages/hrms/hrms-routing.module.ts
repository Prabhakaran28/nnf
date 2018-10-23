import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { HrmsComponent } from './hrms.component';
import { OnboardComponent } from './onboard/onboard.component';
import { SearchEmployeeComponent } from './search-employee/search-employee.component';

const routes: Routes = [{
  path: '',
  component: HrmsComponent,
  children: [{
    path: 'onboard',
    component: SearchEmployeeComponent,
  },
  {
    path: 'maintainEmployee',
    component: OnboardComponent,
  }],
}];

@NgModule({
  imports: [
    RouterModule.forChild(routes),
  ],
  exports: [
    RouterModule,
  ],
})
export class HrmsRoutingModule {

}

export const routedComponents = [
  HrmsComponent,
  SearchEmployeeComponent,

];
