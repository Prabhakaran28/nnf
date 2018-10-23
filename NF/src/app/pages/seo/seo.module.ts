import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SeoComponent } from './seo.component';
import { UploadBacklinksComponent } from './upload-backlinks/upload-backlinks.component';
import { SeoRoutingModule } from './seo-routing.module';
import { ThemeModule } from '../../@theme/theme.module';
import { AppMaterialModule } from '../../app-material/app-material.module';
import { ToasterModule } from 'angular2-toaster';
import { Ng2SmartTableModule } from 'ng2-smart-table';
import { SearchBacklinkComponent } from './search-backlink/search-backlink.component';
import { BacklinksComponent } from './backlinks/backlinks.component';
import { AppCommonModule } from '../../common/app-common.module';
import { SeoDashboardComponent } from './seo-dashboard/seo-dashboard.component';
import { CreatedBacklinksComponent } from './created-backlinks/created-backlinks.component';
import { VisibleBacklinksComponent } from './visible-backlinks/visible-backlinks.component';
import { BacklinkBatchComponent } from './backlink-batch/backlink-batch.component';
import { SearchIcvComponent } from './search-icv/search-icv.component';
import { MaintainIcvComponent } from './search-icv/maintain-icv/maintain-icv.component';
import { IcvDashboardComponent } from './icv-dashboard/icv-dashboard.component';
import { DisavowDashboardComponent } from './disavow-dashboard/disavow-dashboard.component';
import { SeoResourceDashboardComponent } from './seo-resource-dashboard/seo-resource-dashboard.component';
import { SeoDisavowComponent } from './seo-disavow/seo-disavow.component';
import { VisiblelinkDashboardComponent } from './visiblelink-dashboard/visiblelink-dashboard.component';
import { IcvUtilizationDashboardComponent } from './icv-utilization-dashboard/icv-utilization-dashboard.component';
import { ComparisonDashboardComponent } from './comparison-dashboard/comparison-dashboard.component';
import { SeoTeamDashboardComponent } from './seo-team-dashboard/seo-team-dashboard.component';
import { SearchWebsiteComponent } from './search-website/search-website.component';
import { MaintainWebsiteComponent } from './search-website/maintain-website/maintain-website.component';




@NgModule({
  imports: [
    ThemeModule,
    SeoRoutingModule,
    AppCommonModule,
    AppMaterialModule,
    ToasterModule.forRoot(),
    Ng2SmartTableModule,
  ],
  declarations: [SeoComponent,
    UploadBacklinksComponent,

    SearchBacklinkComponent,

    BacklinksComponent,

    SeoDashboardComponent,

    CreatedBacklinksComponent,

    VisibleBacklinksComponent,

    BacklinkBatchComponent,

    SearchIcvComponent,

    MaintainIcvComponent,

    IcvDashboardComponent,

    DisavowDashboardComponent,

    SeoResourceDashboardComponent,

    SeoDisavowComponent,

    VisiblelinkDashboardComponent,

    IcvUtilizationDashboardComponent,

    ComparisonDashboardComponent,

    SeoTeamDashboardComponent,

    SearchWebsiteComponent,

    MaintainWebsiteComponent,


  ]
})
export class SeoModule { }
