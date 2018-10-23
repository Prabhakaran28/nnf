import { Component, OnInit } from '@angular/core';
import { LocalDataSource } from 'ng2-smart-table';
import {HttpClientService } from '../../../../../common/http/services/httpclient.service';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Res } from '../../../../../common/http/models/res.model';
import { environment } from '../../../../../../environments/environment';

@Component({
  selector: 'roles-modal',
  templateUrl: './roles-modal.component.html',
  styleUrls: ['./roles-modal.component.scss']
})
export class RolesModalComponent implements OnInit {
  selectedrows:{};
  settings = {
      actions: false,
      selectMode: 'multi',
      
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
    
    source: LocalDataSource = new LocalDataSource();
    selectedsource: LocalDataSource = new LocalDataSource();
    constructor(private service: HttpClientService,
      private activeModal: NgbActiveModal,
      private router: Router,
      private location: Location) {
      
      this.getRoles();
     
    }
    
    getRoles() {
      this.service.getData(environment.getRoles)
        .subscribe(
          (users:Res) =>  {
            this.source.load(users.data);
          }
        );
    }

    onCancel():void{
      this.activeModal.close();
      
    }
    onAdd():void{
      this.activeModal.close(this.selectedsource);
      
    }
    rowClicked(event): void {
      this.selectedsource.empty();
      this.selectedsource.add(event.selected);
    }
    onDeleteConfirm(event): void {
      if (window.confirm('Are you sure you want to delete?')) {
        event.confirm.resolve();
      } else {
        event.confirm.reject();
      }
    }
  
    ngOnInit() {
    }
  
}
