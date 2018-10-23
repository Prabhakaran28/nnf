import { NgModule } from '@angular/core';

import { ThemeModule } from '../../@theme/theme.module';
import { SystemRoutingModule } from './system-routing.module';
import { AutosequenceComponent } from './productsetup/autosequence/autosequence.component';
import { MetadataComponent } from './productsetup/metadata/metadata.component';
import { SystemComponent } from './system.component';
import { RolesComponent } from './security/roles/roles.component';
import { Ng2SmartTableModule } from 'ng2-smart-table';
import { MaintainroleComponent } from './security/roles/maintainrole/maintainrole.component';
import { ModulesComponent } from './security/modules/modules.component';
import { AuthGuard } from './../../common/http/services/auth-guard.service';
import { RoleGuard } from './../../common/http/services/role-guard.service';
import { ToasterModule } from 'angular2-toaster';
import { UsersModalComponent } from './security/users/users-modal/users-modal.component';
import { UsersComponent } from './security/users/users.component';
import { MaintainUserComponent } from './security/users/maintainuser/maintainuser.component';
import { RolesModalComponent } from './security/roles/roles-modal/roles-modal.component';
import { AppCommonModule } from '../../common/app-common.module';
import { MatDatepickerModule } from '@angular/material/datepicker';
import{ MatInputModule, MatFormFieldModule  }from '@angular/material';
import {CreateMetaDataComponent} from './productsetup/metadata/createmetadata/createmetadata.component';
const components = [
AutosequenceComponent,
MetadataComponent,
CreateMetaDataComponent,
SystemComponent,
RolesComponent,
];
@NgModule({
  imports: [
    ThemeModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule, 
    AppCommonModule,
    SystemRoutingModule,
    Ng2SmartTableModule,
    ToasterModule,
  ],
  declarations: [
    ...components,
    MaintainroleComponent,
    ModulesComponent,
    UsersModalComponent,
    UsersComponent,
    MaintainUserComponent,
    RolesModalComponent,
    
  ],
  providers: [
    AuthGuard,
    RoleGuard,
  ],
})
export class SystemModule { }


