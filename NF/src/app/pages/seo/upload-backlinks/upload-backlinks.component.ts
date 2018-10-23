
import { Component, OnInit, Output, Input, HostBinding, EventEmitter, ElementRef, Renderer2, ViewChild, AnimationStyles } from '@angular/core';
import { FormsModule, ReactiveFormsModule, NgForm } from '@angular/forms';
import { FormBuilder, FormArray, FormGroup, FormControl, Validators } from '@angular/forms';
import { CommonFunctions } from '../../../common/service/commonfunctions.service';
import { ToasterService, ToasterConfig, Toast, BodyOutputType } from 'angular2-toaster';
import { environment } from '../../../../environments/environment';
import { Res } from '../../../common/http/models/res.model';
import { HttpClientService } from '../../../common/http/services/httpclient.service';
import { Filter } from '../../../common/http/Models/filter.model';
import { LocalDataSource } from 'ng2-smart-table';
import { Router, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { FileUploader } from 'ng2-file-upload/ng2-file-upload';
import { ExportTableComponent } from '../../../common/smartable/component/export-table/export-table.component';
import { SmartableServicecolumnComponent } from '../../../common/smartable/component/smartable-servicecolumn/smartable-servicecolumn.component';
import { SmartTable } from '../../../common/smartable/service/smarttable.servics';
import { AnimationKeyframesSequenceMetadata } from '@angular/animations';
import { MetaData } from '../../../common/models/metadata.model';


@Component({
  selector: 'upload-backlinks',
  templateUrl: './upload-backlinks.component.html',
  styleUrls: ['./upload-backlinks.component.scss']
})
export class UploadBacklinksComponent implements OnInit {
  tapToDismiss = false;
  config = new ToasterConfig({
    tapToDismiss: this.tapToDismiss,
  });
  blbf_id: string;
  documents: MetaData = { selectedOption: { id: "", name: "" }, availableOptions: [{ id: "", name: "" }] };
  files = [];
  deletedfiles = [];
  deletefileflag = true;
  editmode = false;
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
  constructor(private service: HttpClientService,
    private commonfunctions: CommonFunctions,
    private toasterService: ToasterService,
    private activeModal: NgbActiveModal,
    private location: Location,
    private smartTable: SmartTable,
    private router: Router,
    private route: ActivatedRoute,


  ) { }
  public hasBaseDropZoneOver: boolean = false;
  public hasAnotherDropZoneOver: boolean = false;
  onCancel(): void {
    this.location.back();

  }

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
            this.commonfunctions.getMetaData(metadata, 'SEO', 'BACKLINK', 'BACKLINK_FILE_TYPE').then(
              (documentType: MetaData) => {
                this.documents = documentType;
              });

            resolve();
          }
        );
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

    this.route
      .queryParams
      .subscribe(params => {
        this.blbf_id = params['blbf_id'];

        if (!this.commonfunctions.isUndefined(this.blbf_id) && this.blbf_id != "") {
          this.setUploadDetails(this.blbf_id);
          this.editmode = true;
        }
        else {
          this.editmode = false;
        }
      })
    this.getMetaData();
    //this.getAttachments(this.employee_id);

    this.uploader.onBuildItemForm = (fileItem: any, form: any) => {
      form.append('FILE_TYPE', fileItem.formData.FileType);
    };
    this.uploader.onAfterAddingFile = (fileItem: any) => {
      fileItem.formData.FileType = this.documents.selectedOption.id;
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



