import { NgModule } from '@angular/core';
import { AppMaterialModule } from '../app-material/app-material.module';
import {  HttpClientService } from './http/services/httpclient.service';
import { AuthInspector } from './http/services/auth.interceptor';
import { CommonFunctions } from './service/commonfunctions.service';
import { RoleGuard } from './http/services/role-guard.service';
import { AuthGuard } from './http/services/auth-guard.service';
import { SmartableLinkcolumnComponent } from './smartable/component/smartable-linkcolumn/smartable-linkcolumn.component';
import { SmartTable } from './smartable/service/smarttable.servics';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import {CommonModule} from '@angular/common';
import { SmartableServicecolumnComponent } from './smartable/component/smartable-servicecolumn/smartable-servicecolumn.component';
import { ThemeModule } from '../@theme/theme.module';
import { ExportTableComponent } from '../common/smartable/component/export-table/export-table.component';
import { FileUploadModule } from 'ng2-file-upload';
import { Ng2GoogleChartsModule } from 'ng2-google-charts';

import { ChartService } from './chart/chart.service';
import { ChartComponent } from './chart/component/chart/chart.component';
import { Ng4LoadingSpinnerService } from '../../../node_modules/ng4-loading-spinner';
import { ButtonViewComponent } from './smartable/component/button-view/button-view.component';




@NgModule({
  declarations: [ SmartableLinkcolumnComponent, 
    SmartableServicecolumnComponent,
    ExportTableComponent,
    ChartComponent,
    ButtonViewComponent,
    
    ],
  imports: [
    AppMaterialModule,
    HttpClientModule,
    RouterModule,
    CommonModule,
    ThemeModule,
    FileUploadModule,
    Ng2GoogleChartsModule,
    
  ],
  providers:[
    HttpClientService,
    CommonFunctions,
    ChartService,
    SmartTable,
    {provide: HTTP_INTERCEPTORS,useClass:AuthInspector, multi:true},
    AuthGuard,
    RoleGuard,
    Ng4LoadingSpinnerService
  ],
  entryComponents: [ SmartableLinkcolumnComponent, SmartableServicecolumnComponent,ButtonViewComponent ],
  exports:[
    ExportTableComponent,
    FileUploadModule,
    Ng2GoogleChartsModule,
    ChartComponent,

  ]
})
export class AppCommonModule { }
