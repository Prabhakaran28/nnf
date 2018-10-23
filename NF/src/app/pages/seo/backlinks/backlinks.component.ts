import { Component, OnInit, Output, Input, HostBinding, EventEmitter, ElementRef, Renderer2, ViewChild } from '@angular/core';
import { LocalDataSource } from 'ng2-smart-table';
import { HttpClientService } from '../../../common/http/services/httpclient.service';
import { Res } from '../../../common/http/models/res.model';
import { Router,ActivatedRoute } from '@angular/router';
import { CommonFunctions } from '../../../common/service/commonfunctions.service';
import { ToasterService, ToasterConfig, Toast, BodyOutputType } from 'angular2-toaster';
import { SmartableLinkcolumnComponent } from '../../../common/smartable/component/smartable-linkcolumn/smartable-linkcolumn.component';
import { LinkElement } from '../../../common/smartable/model/linkelement.model';
import { FormGroup, FormArray,FormsModule, FormControl, FormBuilder, ReactiveFormsModule, Validators, NgForm } from '@angular/forms';
import { environment } from '../../../../environments/environment';
import { MetaData } from '../../../common/models/metadata.model';
import { Filter } from '../../../common/http/Models/filter.model';
import {ExportTableComponent}  from '../../../common/smartable/component/export-table/export-table.component';
import { CreatedBacklinksComponent } from '../created-backlinks/created-backlinks.component';
import { VisibleBacklinksComponent } from '../visible-backlinks/visible-backlinks.component';

@Component({
  selector: 'backlinks',
  templateUrl: './backlinks.component.html',
  styleUrls: ['./backlinks.component.scss']
})

export class BacklinksComponent implements OnInit {
  messages: any = {};
  editmode: boolean;
  constructor(
  ) {
   
  }

  tabs = [
    {
      title: 'Created Backlinks',
      active: true
    },
    {
      title: 'Visible Backlinks',
      active: false
    }
  ];
 



  ngOnInit() {
   
  }




}
