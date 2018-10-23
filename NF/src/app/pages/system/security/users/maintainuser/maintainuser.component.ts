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
import { SmartTable } from '../../../../../common/smartable/service/smarttable.servics';
import { RolesModalComponent } from '../../roles/roles-modal/roles-modal.component';
import { environment } from '../../../../../../environments/environment';

@Component({
  selector: 'maintainusers',
  templateUrl: './maintainuser.component.html',
  styleUrls: ['./maintainuser.component.scss']
})
export class MaintainUserComponent implements OnInit {

  @ViewChild('userid') useridref: ElementRef;
  @ViewChild('username') usernameref: ElementRef;
  @ViewChild('newPassword') newPasswordref: ElementRef;
  
  roledata = [];
  password = "";
  showpasswordField = false;
  rolesource: LocalDataSource = new LocalDataSource();
  editmode: boolean = false;
  deletebutton: boolean = false;
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
  maintainuserform: FormGroup;
  user = {
    "SEUS_ID": "",
    "SEUS_USER_ID": "",
    "SEUS_USER_NAME": "",
    "SEUS_EMAIL": "",
    "SEUS_IS_ACTIVE": true,
    "SEUS_IS_LOCKED": false
  };
  rolesettings = {
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
      SERO_ID: {
        title: 'SERO_ID',
        type: 'number',
      },
      SERO_ROLE_NAME: {
        title: 'Role Name',
        type: 'string',
      },
      SERO_ROLE_DESCRIPTION: {
        title: 'Role Description',
        type: 'string',
      },
    },
  };

  showPasswordField(): void {
    this.showpasswordField = true;
  }
  onCancelResetPassword(): void {
    this.showpasswordField = false;
  }
  onCancel(): void {
    this.location.back();
    

  }
  onResetPassword() {
    var formdata;
    formdata = {
      "SEUS_ID": this.user.SEUS_ID,
      "SEUS_PASSWORD":this.password,
    };
    this.service.postData(environment.resetPassword, formdata).subscribe(
      (res: Res) => {
        if (res.return_code != 0) {
          this.commonfunctions.showToast(this.toasterService, "error", "Error", res.return_message);
          this.newPasswordref.nativeElement.focus();
        }
        else {
          this.commonfunctions.showToast(this.toasterService, "success", "success", res.return_message);
          this.showpasswordField = false;
        }
      }
    );
  }
  onRoleDeleteConfirm(event): void {
    if (window.confirm('Are you sure you want to delete?')) {
      event.confirm.resolve(event);
      var deletedrow = [{
        "SERO_ROLE_NAME": event.data.SERO_ROLE_NAME,
        "SERO_ROLE_DESCRIPTION": event.data.SERO_ROLE_DESCRIPTION,
        "SERO_ID": event.data.SERO_ID
      }];

      this.smartTable.deleteRows(this.roledata, deletedrow, "SERO_ROLE_NAME").subscribe(
        (data: any[]) => {
          this.roledata = data;
        });
    } else {
      event.confirm.reject();
    }
  }
  onDelete(event): void {
    if (confirm("Are you sure to delete " + name)) {
      var formdata;
      formdata = {
        "user": {
          "SEUS_ID": this.user.SEUS_ID,
        }
      };
      this.service.postData(environment.deleteUser, formdata).subscribe(
        (res: Res) => {
          if (res.return_code != 0) {
            this.commonfunctions.showToast(this.toasterService, "error", "Error", res.return_message);
            this.useridref.nativeElement.focus();
          }
          else {
            this.router.navigate(['/pages/system/users'], { queryParams: { message: res.return_message } });
          }
        }
      );
    }
  }
  onSave(): void {

    if (this.maintainuserform.invalid) {
      this.commonfunctions.validateAllFormFields(this.maintainuserform);
      if (this.maintainuserform.controls.userid.invalid) {
        this.useridref.nativeElement.focus();
      }
      else if (this.maintainuserform.controls.username.invalid) {
        this.usernameref.nativeElement.focus();
      }
      return;
    }
    var formdata;
    formdata = {
      "user": {
        "SEUS_ID": this.user.SEUS_ID,
        "SEUS_USER_ID": this.user.SEUS_USER_ID,
        "SEUS_USER_NAME": this.user.SEUS_USER_NAME,
        "SEUS_EMAIL": this.user.SEUS_EMAIL,
        "SEUS_IS_ACTIVE": ((this.user.SEUS_IS_ACTIVE == true) ? "Y" : "N"),
        "SEUS_IS_LOCKED": ((this.user.SEUS_IS_LOCKED == true) ? "Y" : "N"),
      },
      "role": this.roledata
    };
    this.service.postData(environment.saveUser, formdata).subscribe(
      (res: Res) => {
        if (res.return_code != 0) {
          this.commonfunctions.showToast(this.toasterService, "error", "Error", res.return_message);
          this.useridref.nativeElement.focus();
        }
        else {
          this.router.navigate(['/pages/system/users'], { queryParams: { message: res.return_message } });
        }
      }
    );
  }
  public activeModuleModal: NgbModalRef;
  showRoleModal() {
    this.activeModuleModal = this.modalService.open(RolesModalComponent, {
      size: 'lg',
      backdrop: 'static',
      container: 'nb-layout'
    });

    this.activeModuleModal.result.then((result: LocalDataSource) => {
      //load from search
      this.smartTable.getNewRows(this.rolesource, result, "SEMO_MODULE_NAME").subscribe(

        (newrows) => {
          newrows.forEach(element => {
            this.rolesource.append(element);
            this.roledata.push(element);
          });
        });


    }, (reason) => {
      //this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
      console.log(reason);
    });

  };


  setUserDetail(user_id) {
    var filters: Filter[] = [{
      name: "user_id",
      value: user_id
    }];
    this.service.getDatawithFilters(environment.getUser, filters)
      .subscribe(
        (useretails: Res) => {
          var string = JSON.stringify(useretails.data);
          var userdata = JSON.parse(string);
          if (userdata.user[0].SEUS_IS_ACTIVE == "Y") {
            userdata.user[0].SEUS_IS_ACTIVE = true;

          }
          else {
            userdata.user[0].SEUS_IS_ACTIVE = false;
            this.deletebutton = true;
          };
          if (userdata.user[0].SEUS_IS_LOCKED == "Y") {
            userdata.user[0].SEUS_IS_LOCKED = true;
          }
          else {
            userdata.user[0].SEUS_IS_LOCKED = false;
          };
          this.user = userdata.user[0];
          this.rolesource.load(userdata.role);

        }
      );
  }
  ngOnInit() {
    ;

    this.maintainuserform = new FormGroup({
      userid: new FormControl('', [Validators.required, Validators.pattern(environment.format.noSpace)]),
      username: new FormControl('', Validators.required),
      email: new FormControl('', [Validators.required, Validators.pattern(environment.format.email)]),
      isActive: new FormControl(''),
      isLocked: new FormControl('')
    });
    this.route
      .queryParams
      .subscribe(params => {
        const user_id = params['user_id'];

        if (!this.commonfunctions.isUndefined(user_id) && user_id != "") {
          this.setUserDetail(user_id);
          this.editmode = true;
        }
        else {
          this.editmode = false;
        }
      })
  }




}
