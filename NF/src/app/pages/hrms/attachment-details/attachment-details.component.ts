import { Component, OnInit, Output, Input, HostBinding, EventEmitter, ElementRef, Renderer2, ViewChild } from '@angular/core';
import { FormsModule, ReactiveFormsModule, NgForm } from '@angular/forms';
import { FormBuilder, FormArray, FormGroup, FormControl, Validators } from '@angular/forms';
import { CommonFunctions } from '../../../common/service/commonfunctions.service';
import { ToasterService } from 'angular2-toaster';
import { environment } from '../../../../environments/environment';
import { Res } from '../../../common/http/models/res.model';
import { HttpClientService } from '../../../common/http/services/httpclient.service';
import { Filter } from '../../../common/http/Models/filter.model';
import { LocalDataSource } from 'ng2-smart-table';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { FileUploader } from 'ng2-file-upload/ng2-file-upload';
import { ExportTableComponent } from '../../../common/smartable/component/export-table/export-table.component';
import { SmartableServicecolumnComponent } from '../../../common/smartable/component/smartable-servicecolumn/smartable-servicecolumn.component';


@Component({
  selector: 'attachment-details',
  templateUrl: './attachment-details.component.html',
  styleUrls: ['./attachment-details.component.scss']
})

export class AttachmentDetailsComponent implements OnInit {
  @Input() employee_id: string;
  uploadForm: FormGroup;
  document = [];
  documentType = ""
  attachments = [];
  uploader: FileUploader = new FileUploader({ url: environment.saveAttachmentDetails, itemAlias: 'file', authToken: JSON.stringify(localStorage.getItem('auth_app_token')) });
  source: LocalDataSource = new LocalDataSource();
  settings = {
    actions: {
      add: false, edit: false, delete: true, position: 'right'
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
    columns: {
      EMAT_ID: {
        title: 'EMAT_ID',
        type: 'number',
      },
      EMAT_ATTACHMENT_TYPE: {
        title: 'Document Type',
        type: 'string',
      },
      EMAT_ORIGINAL_FILENAME: {
        title: 'File Name',
        type: 'string',
      },
     
      DOWNLOAD: {
        title: 'Download',
        type: 'custom',
        valuePrepareFunction: (value, row) => {
          let linkelement = {
            servicname: environment.getAttachmentDetails,
            EMAT_ID: row.EMAT_ID,
            FILE_LOCATION: row.EMAT_ATTACHMENT_LOCATION,
            FILE_NAME:row.EMAT_ORIGINAL_FILENAME,
          };
          console.log(linkelement);
          return linkelement
        },
        renderComponent: SmartableServicecolumnComponent

      },
    },
  };
  constructor(private service: HttpClientService,
    private commonfunctions: CommonFunctions,
    private toasterService: ToasterService, private activeModal: NgbActiveModal,
    private router: Router,
    private location: Location,
    

  ) { }
  public hasBaseDropZoneOver: boolean = false;
  public hasAnotherDropZoneOver: boolean = false;

  public fileOverBase(e: any): void {
    this.hasBaseDropZoneOver = e;
  }

  public fileOverAnother(e: any): void {
    this.hasAnotherDropZoneOver = e;
  }

  getMetaData() {
    let promise = new Promise((resolve, reject) => {


      var filters: Filter[] = [{
        name: "module",
        value: "HRMS"
      },
      {
        name: "submodule",
        value: "EMPLOYEE"
      },
      
      ];
      this.service.getDatawithFilters(environment.getMetaData, filters)
        .subscribe(
          (metaData: Res) => {
            var string = JSON.stringify(metaData.data);
            var metadata = JSON.parse(string);
            this.commonfunctions.extractMetaData(metadata, 'HRMS', 'EMPLOYEE', 'SECURITY_ROLE').then(
              securityrole => {
                this.document = securityrole[0];
                this.documentType = securityrole[1];
              });
            resolve();
          }
        );
    });
    return promise;
  }
  getAttachments(emp_id) {
    var filters: Filter[] = [{
      name: "emp_id",
      value: emp_id
    }];
    this.service.getDatawithFilters(environment.getAttachmentDetails, filters)
      .subscribe(
        (attachmentdetails: Res) => {
          this.source.load(attachmentdetails.data);
          this.attachments = attachmentdetails.data;
        }
      );

  }
  onDelete(event): void {
    //this.commonfunctions.showToast(this.toasterService, "error", "Error", "Please correct the errors before saving");
    if (window.confirm('Are you sure you want to delete?')) {
      
      this.attachments.forEach(elements => {
        if (elements.EMAT_ID == event.data.EMAT_ID) {
          var formData = {
            "EMAT_ID": event.data.EMAT_ID,
            "EMPH_ID": this.employee_id,
            "EMAT_ATTACHMENT_LOCATION": elements.EMAT_ATTACHMENT_LOCATION
          };
          this.service.postData(environment.deleteAttachment, formData).subscribe(
            (res: Res) => {
              if (res.return_code != 0) {
                this.commonfunctions.showToast(this.toasterService, "error", "Error", res.return_message);
                event.confirm.reject();
                return;
              }
              else {
                this.commonfunctions.showToast(this.toasterService, "success", "Success", "Document deleted successfully");
                event.confirm.resolve(event);
              }
            }
          );
        }
        
      });

    } else {
      event.confirm.reject();
    }
  }
  ngOnInit() {
    ;
    this.getMetaData();
    this.getAttachments(this.employee_id);
    this.uploader.onBuildItemForm = (fileItem: any, form: any) => {
      form.append('EMP_ID', fileItem.formData.EMP_ID); //note comma separating key and value
      form.append('DcoumentType', fileItem.formData.DcoumentType);
    };
    this.uploader.onAfterAddingFile = (fileItem: any) => {
      fileItem.formData.EMP_ID = this.employee_id;
      fileItem.formData.DcoumentType = this.documentType;

    }
    this.uploader.onCompleteItem = (item: any, response: any, status: any, headers: any) => {
      var json = JSON.parse(response);
      if (json.return_code == 0) {
        item.remove();
        this.source.load(json.data);
        this.attachments = json.data;
      }
    };

  }
}