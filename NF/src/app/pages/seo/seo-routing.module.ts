import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SeoComponent } from './seo.component';
import { AuthGuard } from '../../common/http/services/auth-guard.service';
import { UploadBacklinksComponent } from './upload-backlinks/upload-backlinks.component';
import { SearchBacklinkComponent } from './search-backlink/search-backlink.component';
import { BacklinksComponent } from './backlinks/backlinks.component';
import { SeoDashboardComponent } from './seo-dashboard/seo-dashboard.component';
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


const routes: Routes = [{
  path: '',
  //canActivate: [AuthGuard], 
  component: SeoComponent,
  children: [{
    path: 'uploadbacklink',
    canActivate: [AuthGuard], 
    component: UploadBacklinksComponent ,
  },{
    path: 'searchbacklink',
    canActivate: [AuthGuard], 
    component: SearchBacklinkComponent ,
  },{
    path: 'backlink',
    canActivate: [AuthGuard], 
    component: BacklinksComponent ,
  },{
    path: 'sitedashboard',
    canActivate: [AuthGuard], 
    component: SeoDashboardComponent ,
  },{
    path: 'backlinkbatch',
    canActivate: [AuthGuard], 
    component: BacklinkBatchComponent ,
  },{
    path: 'searchicv',
    canActivate: [AuthGuard], 
    component: SearchIcvComponent ,
  },{
    path: 'maintainicv',
    canActivate: [AuthGuard], 
    component: MaintainIcvComponent ,
  },{
    path: 'icvdashboard',
    canActivate: [AuthGuard], 
    component: IcvDashboardComponent ,
  },{
    path: 'disavowdashboard',
    canActivate: [AuthGuard], 
    component: DisavowDashboardComponent ,
  },{
    path: 'seoresourcedashboard',
    canActivate: [AuthGuard], 
    component: SeoResourceDashboardComponent ,
  },{
    path: 'disavow',
    canActivate: [AuthGuard], 
    component: SeoDisavowComponent ,
  },{
    path: 'visiblelinkdashboard',
    canActivate: [AuthGuard], 
    component: VisiblelinkDashboardComponent ,
  },{
    path: 'icvutilization',
    canActivate: [AuthGuard], 
    component: IcvUtilizationDashboardComponent ,
  },{
    path: 'comparesites',
    canActivate: [AuthGuard], 
    component: ComparisonDashboardComponent ,
  },{
    path: 'seoteamdashboard',
    canActivate: [AuthGuard], 
    component: SeoTeamDashboardComponent ,
  },{
    path: 'searchwebsite',
    canActivate: [AuthGuard], 
    component: SearchWebsiteComponent ,
  },{
    path: 'maintainwebsite',
    canActivate: [AuthGuard], 
    component: MaintainWebsiteComponent ,
  }
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
export class SeoRoutingModule {

}

export const routedComponents = [
    SeoComponent
];
