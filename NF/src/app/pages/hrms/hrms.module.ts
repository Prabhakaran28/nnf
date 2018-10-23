import { NgModule } from '@angular/core';

import { ThemeModule } from '../../@theme/theme.module';
import { HrmsRoutingModule, routedComponents } from './hrms-routing.module';
import { OnboardService } from './onboard/onboard.service';
import { PersonalDetailsComponent } from './personal-details/personal-details.component';
import { AddressDetailsComponent } from './address-details/address-details.component';
import { EducationDetailsComponent } from './education-details/education-details.component';
import { EmploymentHistoryComponent } from './employment-history/employment-history.component';
import {AttachmentDetailsComponent} from './attachment-details/attachment-details.component';
import { AppMaterialModule } from '../../app-material/app-material.module';
import { ToasterModule } from 'angular2-toaster';
//import { DlDateTimePickerDateModule } from 'angular-bootstrap-datetimepicker';
import { SearchEmployeeComponent } from './search-employee/search-employee.component';
import { Ng2SmartTableModule } from 'ng2-smart-table';
import { OnboardComponent } from './onboard/onboard.component';
import { AppCommonModule } from '../../common/app-common.module';




@NgModule({

  imports: [
    ThemeModule,
    AppCommonModule,
    HrmsRoutingModule,
    AppMaterialModule,
    ToasterModule,
    //DlDateTimePickerDateModule,
    Ng2SmartTableModule,
  ],
  declarations: [
    ...routedComponents,
    PersonalDetailsComponent,
    AddressDetailsComponent,
    EducationDetailsComponent,
    EmploymentHistoryComponent,
    SearchEmployeeComponent,
    OnboardComponent,
    AttachmentDetailsComponent,
    
    
  ],
  providers: [
    OnboardService,  ]
})
export class HrmsModule { }
