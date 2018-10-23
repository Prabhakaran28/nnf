import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SystemComponent } from './system.component';
import { AutosequenceComponent } from './productsetup/autosequence/autosequence.component';
import { MetadataComponent } from './productsetup/metadata/metadata.component';
import { RolesComponent } from './security/roles/roles.component';
import { MaintainroleComponent } from './security/roles/maintainrole/maintainrole.component';
import { ModulesComponent } from './security/modules/modules.component';
import { AuthGuard } from './../../common/http/services/auth-guard.service';
import { RoleGuard } from './../../common/http/services/role-guard.service';
import { UsersModalComponent } from './security/users/users-modal/users-modal.component';
import { UsersComponent } from './security/users/users.component';
import { MaintainUserComponent } from './security/users/maintainuser/maintainuser.component';
import { RolesModalComponent } from './security/roles/roles-modal/roles-modal.component';
import {CreateMetaDataComponent} from './productsetup/metadata/createmetadata/createmetadata.component';


const routes: Routes = [{
  path: '',
  canActivate: [AuthGuard], 
  component: SystemComponent,
  children: [{
    path: 'autosequence',
    canActivate: [AuthGuard], 
    component: AutosequenceComponent ,
  },{
    path: 'metadata',
    canActivate: [AuthGuard], 
    component: MetadataComponent ,
  },{
    path: 'createmetadata',
    canActivate: [AuthGuard], 
    component: CreateMetaDataComponent ,
  },{
    path: 'roles',
    canActivate: [AuthGuard], 
    component: RolesComponent,
  },{
    path: 'maintainrole',
    canActivate: [AuthGuard], 
    component: MaintainroleComponent,
  },{
    path: 'modules',
    canActivate: [AuthGuard], 
    component: ModulesComponent,
  },{
    path: 'usersmodal',
    canActivate: [AuthGuard], 
    component: UsersModalComponent,
  },
  {
    path: 'users',
    canActivate: [AuthGuard], 
    component: UsersComponent,
  },
  {
    path: 'maintainuser',
    canActivate: [AuthGuard], 
    component: MaintainUserComponent,
  },{
    path: 'rolesmodal',
    canActivate: [AuthGuard], 
    component: RolesModalComponent,
  },
],
}];
@NgModule({
  imports: [
    RouterModule.forChild(routes),
  ],
  exports: [
    RouterModule,
  ],
})
export class SystemRoutingModule {

}

export const routedComponents = [
  SystemComponent
];
