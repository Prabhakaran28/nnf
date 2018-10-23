import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { LocalDataSource } from 'ng2-smart-table';
import { HttpClientService } from '../../../../../common/http/services/httpclient.service';
import { Location } from '@angular/common';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { CommonFunctions } from '../../../../../common/service/commonfunctions.service';
import { FormGroup, FormControl, FormBuilder, ReactiveFormsModule, Validators, NgForm } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule, MatFormFieldModule } from '@angular/material';
import { BrowserModule } from '@angular/platform-browser';
import { Res } from '../../../../../common/http/models/res.model';
import { ToasterService, ToasterConfig, Toast, BodyOutputType } from 'angular2-toaster';
import 'style-loader!angular2-toaster/toaster.css';
import { Filter } from '../../../../../common/http/models/filter.model';
import { SmartTable } from '../../../../../common/smartable/service/smarttable.servics';

import { environment } from '../../../../../../environments/environment';

@Component({
  selector: 'createmetadata',
  templateUrl: './createmetadata.component.html',
  styleUrls: ['./createmetadata.component.scss']
})
export class CreateMetaDataComponent implements OnInit {
  createMetadataform: FormGroup;
  @ViewChild('module') moduleref: ElementRef;
  constructor(private service: HttpClientService,
    private commonfunctions: CommonFunctions,
    private smartTable: SmartTable,
    private modalService: NgbModal,
    private toasterService: ToasterService,
    private router: Router,
    private route: ActivatedRoute,
    private location: Location) {

  }
  onCancel(): void {
    this.location.back();

  }
  onSubmit(f) {
    if (f.invalid) {
      this.commonfunctions.showToast(this.toasterService, "error", "Error", "Please correct the errors before saving");
    }
    else {
      var formdata = {
        module: this.createMetadataform.get('moduleControl').value,
        subModule: this.createMetadataform.get('subModuleControl').value,
        type: this.createMetadataform.get('typeControl').value,
        subType: this.createMetadataform.get('subTypeControl').value,
        code: this.createMetadataform.get('codeControl').value,
        value: this.createMetadataform.get('valueControl').value,
        default: this.createMetadataform.get('defaultControl').value,
        active: this.createMetadataform.get('activeControl').value,
        createdBy: this.createMetadataform.get('createdByControl').value,

      }
      this.service.postData(environment.saveMetaDataDetails, formdata).subscribe(
        (res: Res) => {
          if (res.return_code != 0) {
            this.commonfunctions.showToast(this.toasterService, "error", "Error", res.return_message);
            this.moduleref.nativeElement.focus();
          }
          else {
            this.commonfunctions.showToast(this.toasterService, "success", "Success", "MataData Details Saved successfully");
          }
        }
      );
    }
  }
  ngOnInit() {
    this.createMetadataform = new FormGroup({
      moduleControl: new FormControl('', Validators.required),
      subModuleControl: new FormControl('', Validators.required),
      typeControl: new FormControl('', Validators.required),
      subTypeControl: new FormControl('', Validators.required),
      codeControl: new FormControl('', Validators.required),
      valueControl: new FormControl('', Validators.required),
      defaultControl: new FormControl('', Validators.required),
      activeControl: new FormControl('', Validators.required),
      createdByControl: new FormControl('', Validators.required),

    });
  }
}