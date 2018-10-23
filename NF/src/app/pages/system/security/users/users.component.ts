import { Component, OnInit } from '@angular/core';
import { LocalDataSource } from 'ng2-smart-table';
import { HttpClientService } from '../../../../common/http/services/httpclient.service';
import { Res } from '../../../../common/http/models/res.model';
import { ActivatedRoute } from '@angular/router';
import { CommonFunctions } from '../../../../common/service/commonfunctions.service';
import { ToasterService, ToasterConfig, Toast, BodyOutputType } from 'angular2-toaster';
import { MaintainUserComponent } from './maintainuser/maintainuser.component';
import { SmartableLinkcolumnComponent } from '../../../../common/smartable/component/smartable-linkcolumn/smartable-linkcolumn.component';
import { LinkElement } from '../../../../common/smartable/model/linkelement.model';
import { FormGroup, FormControl, FormBuilder, ReactiveFormsModule, Validators, NgForm } from '@angular/forms';
import { environment } from '../../../../../environments/environment';

@Component({
  selector: 'users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersComponent implements OnInit {
  selectedStatusOption: string = "Active";
  selectedLockOption: string = "Not Locked" ;

  user = {
    "SEUS_USER_ID": "",
    "SEUS_USER_NAME": "",
    "SEUS_EMAIL": "",
    "SEUS_IS_ACTIVE": this.selectedStatusOption,
    "SEUS_IS_LOCKED": this.selectedLockOption,
  };

  message: string = '';
  settings = {
    actions: false,
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
    attr: {
      // class: 'table table-bordered'
    },
    hideSubHeader :true,
    columns: {
      SEUS_USER_NAME: {
        title: 'User Name',
        type: 'custom',
        filter: false,
        valuePrepareFunction: (value, row) => {
          let linkelement = {
            linkname: value,
            link: "/pages/system/maintainuser",
            linkparam: { user_id: row.SEUS_ID }
          };
          return linkelement
        },
        renderComponent: SmartableLinkcolumnComponent

      },
      SEUS_USER_ID: {
        title: 'User ID',
        type: 'string',
        filter: false,
      },
      SEUS_EMAIL: {
        title: 'Email ID',
        type: 'string',
        filter: false,
      },
      SEUS_IS_LOCKED: {
        title: 'Lock Status',
        type: 'string',
        filter: false,
      },
      SEUS_IS_ACTIVE: {
        title: 'User Status',
        type: 'string',
        filter: false,
      },

    },
  };


  source: LocalDataSource = new LocalDataSource();

  constructor(private service: HttpClientService,
    private route: ActivatedRoute,
    private commonfunctions: CommonFunctions,
    private toasterService: ToasterService,

  ) {
    this.onSearch();
  }
  onSearch() {
    var formdata;
    this.user.SEUS_IS_ACTIVE = this.selectedStatusOption;
    this.user.SEUS_IS_LOCKED = this.selectedLockOption;
    formdata = {
      "user": this.user
    };
    this.service.postData(environment.searchUsers, formdata).subscribe(
      (res: Res) => {
        if (res.return_code != 0) {
          this.commonfunctions.showToast(this.toasterService, "error", "Error", res.return_message);
        }
        else {
          this.source.load(res.data);
        }
      }
    );
  }
  getUsers() {
    this.service.getData('/api/getusers')
      .subscribe(
        (users: Res) => {
          this.source.load(users.data);
        }
      );
  }

  ngOnInit() {
    this.route
      .queryParams
      .subscribe(params => {
        const message = params['message'];
        if (!this.commonfunctions.isUndefined(message) && message != "") {
          this.commonfunctions.showToast(this.toasterService, "success", "Success", params['message']);
        }
      });

  }

}
