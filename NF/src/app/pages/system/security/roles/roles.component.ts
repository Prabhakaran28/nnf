import { Component, OnInit } from '@angular/core';
import { LocalDataSource } from 'ng2-smart-table';
import { HttpClientService } from '../../../../common/http/services/httpclient.service';
import { Res } from '../../../../common/http/models/res.model';
import { ActivatedRoute } from '@angular/router';
import { CommonFunctions } from '../../../../common/service/commonfunctions.service';
import { ToasterService, ToasterConfig, Toast, BodyOutputType } from 'angular2-toaster';
import { MaintainroleComponent } from './maintainrole/maintainrole.component';
import { SmartableLinkcolumnComponent } from '../../../../common/smartable/component/smartable-linkcolumn/smartable-linkcolumn.component';
import { LinkElement } from '../../../../common/smartable/model/linkelement.model';
import { environment } from '../../../../../environments/environment';
import { SmartTable } from '../../../../common/smartable/service/smarttable.servics';
import {ExportTableComponent}  from '../../../../common/smartable/component/export-table/export-table.component';
@Component({
  selector: 'roles',
  templateUrl: './roles.component.html',
  styleUrls: ['./roles.component.scss']
})
export class RolesComponent implements OnInit {
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
    columns: {
      /*SERO_ID: {
        title: 'Role ID',
        type: 'number',
      },*/
      SERO_ROLE_NAME: {
        title: 'Role Name',
        type: 'custom',
        valuePrepareFunction: (value, row) => {
          let linkelement = {
            linkname: value,
            link: "/pages/system/maintainrole",
            linkparam: {role_id: row.SERO_ID }
          };
          return linkelement
        },
        renderComponent: SmartableLinkcolumnComponent

      },
      SERO_ROLE_DESCRIPTION: {
        title: 'Description',
        type: 'string',
      },
    },
  };

  source: LocalDataSource = new LocalDataSource();

  constructor(private service: HttpClientService,
    private route: ActivatedRoute,
    private commonfunctions: CommonFunctions,
    private toasterService: ToasterService,
    private SmartTableService: SmartTable,

  ) {

    this.getRoles();

  }

  getRoles() {
    this.service.getData(environment.getRoles)
      .subscribe(
        (roles: Res) => {
          if (roles.return_code == 0) {
            this.source.load(roles.data);
          }
          else {
            this.message = roles.return_message;

          }

        },
        (err) => {
          console.log('Something went wrong! ' + err.error);
        }
      );
  }

  onDeleteConfirm(event): void {
    if (window.confirm('Are you sure you want to delete?')) {
      event.confirm.resolve();
    } else {
      event.confirm.reject();
    }
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

