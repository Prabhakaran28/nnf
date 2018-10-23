import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { LocalDataSource } from 'ng2-smart-table';
import { HttpClientService } from '../../../../../common/http/services/httpclient.service';
import { Location } from '@angular/common';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { ModulesComponent } from '../../modules/modules.component';
import { UsersModalComponent } from '../../users/users-modal/users-modal.component';
import { CommonFunctions } from '../../../../../common/service/commonfunctions.service';
import { FormGroup, FormControl, FormBuilder, ReactiveFormsModule, Validators, NgForm } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';

import { BrowserModule } from '@angular/platform-browser';
import { Res } from '../../../../../common/http/models/res.model';
import { ToasterService, ToasterConfig, Toast, BodyOutputType } from 'angular2-toaster';
import 'style-loader!angular2-toaster/toaster.css';
import { Filter } from '../../../../../common/http/models/filter.model';
import { RoleDetails } from './roledetails.model';
import { SmartTable } from '../../../../../common/smartable/service/smarttable.servics';
import { Module } from './module.model';
import { environment } from '../../../../../../environments/environment';
@Component({
  selector: 'maintainrole',
  templateUrl: './maintainrole.component.html',
  styleUrls: ['./maintainrole.component.scss']
})
export class MaintainroleComponent implements OnInit {
  @ViewChild('rolename') rolenameref: ElementRef;
  @ViewChild('roledescription') roledescriptionref: ElementRef;
  moduledata = [];
  userdata = [];
  usersource: LocalDataSource = new LocalDataSource();
  modulesource: LocalDataSource = new LocalDataSource();
  searchmodulesource: LocalDataSource = new LocalDataSource();
  constructor(private service: HttpClientService,
    private commonfunctions: CommonFunctions,
    private smartTable: SmartTable,
    private modalService: NgbModal,
    private toasterService: ToasterService,
    private router: Router,
    private route: ActivatedRoute,
    private location: Location) {

  }

  message: string = '';
  maintainroleform: FormGroup;
  role = {
    "SERO_ID": "",
    "SERO_ROLE_DESCRIPTION": "",
    "SERO_ROLE_NAME": ""
  };
  modulesettings = {
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
      SEMO_ID: {
        title: 'SEMO_ID',
        type: 'number',
      },
      SEMO_MODULE_NAME: {
        title: 'Module Name',
        type: 'string',
      },
      SEMO_DESCRIPTION: {
        title: 'Description',
        type: 'string',
      },
    },
  };
  usersettings = {
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
      SEUS_ID: {
        title: 'SEUS ID',
        type: 'string',
      },
      SEUS_USER_NAME: {
        title: 'User Name',
        type: 'string',
      },
      SEUS_USER_ID: {
        title: 'User ID',
        type: 'string',
      },
    },
  };




  onCancel(): void {
    this.location.back();

  }

  onModuleDeleteConfirm(event): void {
    if (window.confirm('Are you sure you want to delete?')) {
      event.confirm.resolve();
      var deletedrow = [{
        "SEMO_MODULE_NAME": event.data.SEMO_MODULE_NAME,
        "SEMO_DESCRIPTION": event.data.SEMO_DESCRIPTION,
        "SEMO_ID": event.data.SEMO_ID
      }];
      this.smartTable.deleteRows(this.moduledata, deletedrow, "SEMO_MODULE_NAME").subscribe(
        (data: any[]) => {
          this.moduledata = data;
        });
    } else {
      event.confirm.reject();
    }
  }
  onUserDeleteConfirm(event): void {
    if (window.confirm('Are you sure you want to delete?')) {
      event.confirm.resolve();
      var deletedrow = [{
        "SEUS_USER_NAME": event.data.SEUS_USER_NAME,
        "SEUS_USER_ID": event.data.SEUS_USER_ID,
        "SEUS_ID": event.data.SEUS_ID
      }];
      this.smartTable.deleteRows(this.userdata, deletedrow, "SEUS_USER_ID").subscribe(
        (data: any[]) => {
          this.userdata = data;
        });
    } else {
      event.confirm.reject();
    }
  }

  onSave(): void {

    if (this.maintainroleform.invalid) {
      this.commonfunctions.validateAllFormFields(this.maintainroleform);
      if (this.maintainroleform.controls.rolename.invalid) {
        this.rolenameref.nativeElement.focus();
      }
      else if (this.maintainroleform.controls.roledescription.invalid) {
        this.roledescriptionref.nativeElement.focus();
      }
      return;
    }
    var formdata;
            formdata = {
              "role": this.role,
              "module": this.moduledata,
              "user": this.userdata,
            };
            this.service.postData(environment.saveRole, formdata).subscribe(
              (res: Res) => {
                if (res.return_code != 0) {
                  this.commonfunctions.showToast(this.toasterService, "error", "Error", res.return_message);
                  this.rolenameref.nativeElement.focus();
                }
                else {
                  this.router.navigate(['/pages/system/roles'], { queryParams: { message: res.return_message } });
                }
              }
            );
  }
  public activeModuleModal: NgbModalRef;
  showModuleModal() {
    this.activeModuleModal = this.modalService.open(ModulesComponent, {
      size: 'lg',
      backdrop: 'static',
      container: 'nb-layout'
    });

    this.activeModuleModal.result.then((result: LocalDataSource) => {
      //load from search
      this.smartTable.getNewRows(this.modulesource, result, "SEMO_MODULE_NAME").subscribe(

        (newrows: Module[]) => {
          newrows.forEach(element => {
            this.modulesource.append(element);
            this.moduledata.push(element);
          });
        });


    }, (reason) => {
      //this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
      console.log(reason);
    });

  };

  public activeUserModal: NgbModalRef;
  showUserModal() {
    this.activeUserModal = this.modalService.open(UsersModalComponent, {
      size: 'lg',
      backdrop: 'static',
      container: 'nb-layout'
    });

    this.activeUserModal.result.then((result: LocalDataSource) => {
      //load from search
      this.smartTable.getNewRows(this.usersource, result, "SEUS_USER_ID").subscribe(

        (newrows: Module[]) => {
          newrows.forEach(element => {
            this.usersource.append(element);
            this.userdata.push(element);
          });
        });


    }, (reason) => {
      //this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
      console.log(reason);
    });

  };
  setRoleDetail(role_id) {
    var filters: Filter[] = [{
      name: "role_id",
      value: role_id
    }];
    this.service.getDatawithFilters(environment.getRole, filters)
      .subscribe(
        (roledetails: Res) => {
          var string = JSON.stringify(roledetails.data);
          var roledata: RoleDetails = JSON.parse(string);
          this.role = roledata.role[0];
          this.modulesource.load(roledata.module);
          this.usersource.load(roledata.user);
        }
      );
  }
  ngOnInit() {
    ;

    this.maintainroleform = new FormGroup({
      rolename: new FormControl('', [Validators.required, Validators.pattern(/^\S*$/)]),
      roledescription: new FormControl('', Validators.required)
    });
    this.route
      .queryParams
      .subscribe(params => {
        const role_id = params['role_id'];

        if (!this.commonfunctions.isUndefined(role_id) && role_id != "") {
          this.setRoleDetail(role_id);
        }
      })
  }



}
