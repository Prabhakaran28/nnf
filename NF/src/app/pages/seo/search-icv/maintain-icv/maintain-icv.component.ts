import { Component, OnInit, EventEmitter, Output, Input, ElementRef, ViewChild } from '@angular/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { FormGroup, FormControl, FormBuilder, ReactiveFormsModule, FormGroupDirective, Validators, NgForm } from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core'
import { ToasterService, ToasterConfig, Toast, BodyOutputType } from 'angular2-toaster';
import { HttpClientService } from '../../../../common/http/services/httpclient.service';
import { Res } from '../../../../common/http/models/res.model';
import { CommonFunctions } from '../../../../common/service/commonfunctions.service';
import { environment } from '../../../../../environments/environment';
import { Filter } from '../../../../common/http/Models/filter.model';
import { Observable } from 'rxjs/Rx';
import 'rxjs/add/observable/of';
import { Router, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { FileUploader } from 'ng2-file-upload/ng2-file-upload';
import { MetaData } from '../../../../common/models/metadata.model';
import { SmartTable } from '../../../../common/smartable/service/smarttable.servics';
import { SmartableServicecolumnComponent } from '../../../../common/smartable/component/smartable-servicecolumn/smartable-servicecolumn.component';
import { LocalDataSource } from '../../../../../../node_modules/ng2-smart-table';

@Component({
  selector: 'maintain-icv',
  templateUrl: './maintain-icv.component.html',
  styleUrls: ['./maintain-icv.component.scss']
})
export class MaintainIcvComponent implements OnInit {
  editmode = false;
  blic_id = null;
  blic_status = null;
  rejectionstatus = false;
  status: MetaData = { selectedOption: { id: "", name: "" }, availableOptions: [{ id: "", name: "" }] };
  rejectionReason: MetaData = { selectedOption: { id: "", name: "" }, availableOptions: [{ id: "", name: "" }] };
  category: MetaData = { selectedOption: { id: "", name: "" }, availableOptions: [{ id: "", name: "" }] };
  process: MetaData = { selectedOption: { id: "", name: "" }, availableOptions: [{ id: "", name: "" }] };
  followflag: MetaData = { selectedOption: { id: "", name: "" }, availableOptions: [{ id: "", name: "" }] };
  maintainicvform: FormGroup;
  constructor(private service: HttpClientService,
    private commonfunctions: CommonFunctions,
    private router: Router,
    private route: ActivatedRoute,
    private location: Location,
    private toasterService: ToasterService) { }
  @ViewChild('backlinkSite') backlinkSiteref: ElementRef;

  getMetaData() {
    let promise = new Promise((resolve, reject) => {
      var filters: Filter[] = [{
        name: "module",
        value: "SEO"
      },
      {
        name: "submodule",
        value: "BACKLINK"
      },
      ];
      this.service.getDatawithFilters(environment.getMetaData, filters)
        .subscribe(
          (metaData: Res) => {
            var string = JSON.stringify(metaData.data);
            var metadata = JSON.parse(string);
            this.commonfunctions.getMetaData(metadata, 'SEO', 'BACKLINK', 'ICV_STATUS').then(
              (status: MetaData) => {
                this.status = status;
                var i = -1;
                this.status.availableOptions.forEach(element => {
                  i++;
                  if (element.id == 'ALL') {
                    this.status.availableOptions.splice(i);
                  }

                });
              });
            this.commonfunctions.getMetaData(metadata, 'SEO', 'BACKLINK', 'REJECTION_REASON').then(
              (rejectionReason: MetaData) => {
                this.rejectionReason = rejectionReason;
              });
            this.commonfunctions.getMetaData(metadata, 'SEO', 'BACKLINK', 'ICV_CATEGORY').then(
              (category: MetaData) => {
                this.category = category;
              });
            this.commonfunctions.getMetaData(metadata, 'SEO', 'BACKLINK', 'ICV_PROCESS').then(
              (process: MetaData) => {
                this.process = process;
              });
            this.commonfunctions.getMetaData(metadata, 'SEO', 'BACKLINK', 'ICV_FOLLOWFLAG').then(
              (followflag: MetaData) => {
                this.followflag = followflag;
              });
            resolve();
          }
        );
    });
    return promise;
  }
  setIcvDetail(blic_id) {
    var filters: Filter[] = [{
      name: "blic_id",
      value: blic_id
    }];

    this.service.getDatawithFilters(environment.getIcvDetails, filters)
      .subscribe(
        (icvDetails: Res) => {
          var string = JSON.stringify(icvDetails.data);
          var icvData = JSON.parse(string);
          if (icvDetails.return_code == 0) {
            this.maintainicvform.setValue({
              dateIdenfiiedControl: icvData[0].BLIC_DATE_IDENTIFIED,
              backlinkSiteControl: icvData[0].BLIC_BACKLINK_SITE,
              categoryControl: icvData[0].BLIC_CATEGORY,
              processControl: icvData[0].BLIC_PROCESS,
              domainAuthorityControl: icvData[0].BLIC_DOMAIN_AUTHORITY,
              sourceControl: icvData[0].BLIC_DOMAIN_SOURCE,
              sourceURLControl: icvData[0].BLIC_DOMAIN_SOURCE_URL,
              followFlagControl: icvData[0].BLIC_FOLLOW_FLAG,
              remarksControl: icvData[0].BLIC_REMARKS,
              rejectionReasonControl: icvData[0].BLIC_REJECTION_REASON,
            });
            this.status.selectedOption.id = icvData[0].BLIC_STATUS_CODE;;
            this.status.selectedOption.name = icvData[0].BLIC_STATUS;
            this.rejectionReason.selectedOption.name = icvData[0].BLIC_REJECTION_REASON;
            this.rejectionReason.selectedOption.name = icvData[0].BLIC_REJECTION_REASON;
            this.blic_status = icvData[0].BLIC_STATUS;
            this.maintainicvform.get('backlinkSiteControl').disable();
            this.onStatusChange();
          }
          else {
            this.commonfunctions.showToast(this.toasterService, "error", "Error", icvDetails.return_message);
          }
        }
      );
  }

  onCancel(): void {
    this.location.back();

  }
  onStatusChange(): void {
    if (this.status.selectedOption.id == 'RJ') {
      this.rejectionstatus = true;
      this.maintainicvform.get('remarksControl').setValidators([Validators.required]);
      this.maintainicvform.get('rejectionReasonControl').setValidators([Validators.required]);
      this.maintainicvform.get('categoryControl').clearValidators();
      this.maintainicvform.get('processControl').clearValidators();
      this.maintainicvform.get('domainAuthorityControl').clearValidators();
      this.maintainicvform.get('followFlagControl').clearValidators();
    }
    else {
      this.rejectionstatus = false;
      this.maintainicvform.get('remarksControl').clearValidators();
      this.maintainicvform.get('rejectionReasonControl').clearValidators();
      this.maintainicvform.get('categoryControl').setValidators([Validators.required]);
      this.maintainicvform.get('processControl').setValidators([Validators.required]);
      this.maintainicvform.get('domainAuthorityControl').setValidators([Validators.required]);
      this.maintainicvform.get('followFlagControl').setValidators([Validators.required]);
    }
    this.maintainicvform.get('remarksControl').updateValueAndValidity();
    this.maintainicvform.get('rejectionReasonControl').updateValueAndValidity();
    this.maintainicvform.get('categoryControl').updateValueAndValidity();
    this.maintainicvform.get('processControl').updateValueAndValidity();
    this.maintainicvform.get('domainAuthorityControl').updateValueAndValidity();
    this.maintainicvform.get('followFlagControl').updateValueAndValidity();

  }
  onSubmit(f, mode) {
    var proceed = false;
    if (mode == 'D') {
      var r = confirm("Are you sure want to delete this backlink site: " + this.maintainicvform.get('backlinkSiteControl').value);
      if (r == true) {
        proceed = true;
      } else {
        proceed = false;
      }
    }
    else {
      proceed = true;
    }
    if (proceed) {
      if (f.invalid) {
        this.commonfunctions.showToast(this.toasterService, "error", "Error", "Please correct the errors before saving");
      }
      else {
        var formdata = {
          blic_id: this.blic_id,
          dateIdenfiied: this.maintainicvform.get('dateIdenfiiedControl').value,
          backlinkSite: this.maintainicvform.get('backlinkSiteControl').value,
          category: this.maintainicvform.get('categoryControl').value,
          process: this.maintainicvform.get('processControl').value,
          domainAuthority: this.maintainicvform.get('domainAuthorityControl').value,
          source: this.maintainicvform.get('sourceControl').value,
          sourceURL: this.maintainicvform.get('sourceURLControl').value,
          followFlag: this.maintainicvform.get('followFlagControl').value,
          remarks: this.maintainicvform.get('remarksControl').value,
          status: this.status.selectedOption.id,
          rejectionReason: this.maintainicvform.get('rejectionReasonControl').value,
          mode: mode,
        }
        this.service.postData(environment.saveIcvDetails, formdata).subscribe(
          (res: Res) => {
            if (res.return_code != 0) {
              this.commonfunctions.showToast(this.toasterService, "error", "Error", res.return_message);
              this.backlinkSiteref.nativeElement.focus();
            }
            else {
              this.commonfunctions.showToast(this.toasterService, "success", "Success", res.return_message);
              //this.blic_id = res.data[0].BLIC_ID;
              //this.editmode = true;
              this.setIcvDetail(res.data[0].BLIC_ID);
            }
          }
        );
      }
    }
  }

  tapToDismiss = false;
  config = new ToasterConfig({
    tapToDismiss: this.tapToDismiss,
  });
  blbf_id: string;
  documents: MetaData = { selectedOption: { id: "", name: "" }, availableOptions: [{ id: "", name: "" }] };
  files = [];
  deletedfiles = [];
  deletefileflag = true;

  uploader: FileUploader = new FileUploader({ url: environment.uploadBacklinks, itemAlias: 'file', authToken: JSON.stringify(localStorage.getItem('auth_app_token')) });
  filesource: LocalDataSource = new LocalDataSource();
  settings = {
    actions: {
      add: false, edit: false, delete: this.deletefileflag, position: 'right'
    },
    add: {
      addButtonContent: '<i class="nb-plus"></i>',
      createButtonContent: '<i class="nb-checkmark"></i>',
      cancelButtonContent: '<i class="nb-close"></i>',
    },
    edit: {
      editButtonContent: '<i class="nb-edit"></i>',
      saveButtonContent: '<i class="nb-checkmark"></i>',
      cancelButtonContent: '<i class="nb-close"></i>',
    },
    delete: {
      deleteButtonContent: '<i class="nb-trash"></i>',
      confirmDelete: true,
    },
    hideSubHeader: true,
    columns: {
      BLBF_ID: {
        title: 'BLBF ID',
        type: 'string',
      },
      BLBF_FILE_TYPE: {
        title: 'File Type',
        type: 'string',
      },
      BLBF_FILE_NAME: {
        title: 'File Name',
        type: 'string',
      },
      BLBF_STATUS: {
        title: 'Status',
        type: 'string',
      },
      BLBF_ICV_FLAG: {
        title: 'ICV Flag',
        type: 'string',
      },
      BLBF_ERR_DESCRIPTION: {
        title: 'Error Description',
        type: 'string',
      },
      DOWNLOAD: {
        title: 'Download',
        type: 'custom',
        valuePrepareFunction: (value, row) => {
          let linkelement = {
            servicname: environment.getBacklinkFile,
            BLBF_ID: row.BLBF_ID,
            FILE_LOCATION: row.BLBF_FILE_LOCATION,
            FILE_NAME: row.BLBF_FILE_NAME,
          };
          return linkelement
        },
        renderComponent: SmartableServicecolumnComponent

      },
    },
  };

  public hasBaseDropZoneOver: boolean = false;
  public hasAnotherDropZoneOver: boolean = false;

  prepareDeletefiles(): Promise<any> {
    let promise = new Promise((resolve, reject) => {
      let len = this.deletedfiles.length;
      let i = 0;
      let deleteServiceData = [];
      this.deletedfiles.forEach(file => {
        var objdeleteServiceData = {
          url: environment.deleteBacklinkFile,
          formdata: file
        };
        deleteServiceData.push(objdeleteServiceData)
        i++;
        if (i == len) {
          resolve(deleteServiceData);
        }

      });

    });
    return promise;
  }
  async  deletefiles(): Promise<any> {
    let promise = new Promise((resolve, reject) => {
      let len = this.deletedfiles.length;
      let i = 0;
      this.deletedfiles.forEach(file => {
        this.service.postData(environment.deleteBacklinkFile, file).subscribe(
          (res) => {
            if (res.return_code != 0) {
              this.tapToDismiss = false;
              this.commonfunctions.showToast(this.toasterService, "error", "Error", res.return_message);
            }
            else {
              this.tapToDismiss = true;
              this.commonfunctions.showToast(this.toasterService, "success", "Success", "Backlink file " + file.BLVF_FILE_NAME + " deleted Successfully");
            }
          });
        i++;
        if (i == len) {
          resolve();
        }

      });

    });
    return promise;
  }

  onDelete(event): void {

    //this.commonfunctions.showToast(this.toasterService, "error", "Error", "Please correct the errors before saving");
    if (window.confirm('Are you sure you want to delete?')) {
      var i = 0;
      this.files.forEach((element) => {
        if (element.BLBF_ID == event.data.BLBF_ID) {
          var deletedata = {
            "BLBF_ID": event.data.BLBF_ID,
            "BLBF_FILE_NAME": element.BLBF_FILE_NAME,
            "BLBF_FILE_LOCATION": element.BLBF_FILE_LOCATION
          };
          this.service.postData(environment.deleteBacklinkFile, deletedata).subscribe(
            (res) => {
              if (res.return_code != 0) {
                event.confirm.reject();
                this.tapToDismiss = false;
                this.commonfunctions.showToast(this.toasterService, "error", "Error", res.return_message);
              }
              else {
                event.confirm.resolve(event);
                this.deletedfiles.splice(element);
                this.tapToDismiss = true;
                this.commonfunctions.showToast(this.toasterService, "success", "Success", "Backlink file " + element.BLBF_FILE_NAME + " deleted Successfully");
              }
            });
        }
      });

    } else {
      event.confirm.reject();
    }
  }
  setUploadDetails(blbf_id) {
    var filters: Filter[] = [{
      name: "blbf_id",
      value: blbf_id
    }];
    this.service.getDatawithFilters(environment.getBacklinkFile, filters)
      .subscribe(
        (backlinks) => {
          var string = JSON.stringify(backlinks);
          var backlinkdata = JSON.parse(string);
          if (backlinkdata.return_code != 0) {
            this.tapToDismiss = false;
            this.commonfunctions.showToast(this.toasterService, "error", "error", backlinkdata.return_message);
          }
          else {
            this.files = backlinkdata.data;
            this.filesource.load(backlinkdata.data);
          }
        }
      );
  }
  OnDocumentTypeChange(id) {
    var value = this.documents.availableOptions.filter(value => value.id === id);
    this.documents.selectedOption.name = value[0].name;
  }
  ngOnInit() {
    this.getMetaData();
    this.maintainicvform = new FormGroup({
      dateIdenfiiedControl: new FormControl({ disabled: true }),
      backlinkSiteControl: new FormControl('', Validators.required),
      categoryControl: new FormControl('', Validators.required),
      processControl: new FormControl('', Validators.required),
      domainAuthorityControl: new FormControl('', Validators.required),
      sourceControl: new FormControl(),
      sourceURLControl: new FormControl(),
      followFlagControl: new FormControl('', Validators.required),
      remarksControl: new FormControl(),
      rejectionReasonControl: new FormControl(),
    });
    this.maintainicvform.patchValue({
      dateIdenfiiedControl: new Date()
    });
    this.route
      .queryParams
      .subscribe(params => {
        this.blic_id = params['blic_id'];

        if (!this.commonfunctions.isUndefined(this.blic_id) && this.blic_id != "") {
          this.setIcvDetail(this.blic_id);
          this.editmode = true;
        }
        else {
          this.editmode = false;
        }
      });


    this.uploader.onBuildItemForm = (fileItem: any, form: any) => {
      form.append('FILE_TYPE', fileItem.formData.FileType);
    };
    this.uploader.onAfterAddingFile = (fileItem: any) => {
      fileItem.formData.FileType = "ICV";
      fileItem.formData.Mode = "I";
      fileItem.upload();
    }

    this.uploader.onCompleteItem = (item: any, response: any, status: any, headers: any) => {
      var json = JSON.parse(response);
      if (json.return_code == 0) {
        item.remove();
        this.files.push(json.data[0]);
        this.filesource.append(json.data[0]);
        this.tapToDismiss = true;
        this.commonfunctions.showToast(this.toasterService, "success", "success", "File " + item.file.name + " uploaded successfully");
      }
      else {
        this.tapToDismiss = false;
        this.commonfunctions.showToast(this.toasterService, "error", "error", "Error uploading file: " + item.file.name + " " + json.return_message);
      }
    };

  }

}




