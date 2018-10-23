import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { ViewCell } from 'ng2-smart-table';
import {Routes, RouterModule, Router} from '@angular/router';
import {Observable} from "rxjs";
@Component({
    selector: 'button-view',
    template: `<div style="text-align: center;">
    <a (click)="onClick()" [routerLink]=" ['./'] "
    routerLinkActive="active" [routerLinkActiveOptions]= "{exact: true}" >{{ renderValue }}</a>
    </div>
  `,
})
export class ButtonViewComponent implements ViewCell, OnInit {
    renderValue: string;

    @Input() value: string | number = '';
    @Input() rowData: any='Hello';

    @Output() save: EventEmitter<any> = new EventEmitter();
    @Output() sendInformationTOANI: EventEmitter<any> = new EventEmitter();

    ngOnInit() {
        this.renderValue = this.value.toString().toUpperCase();
    }
    constructor(private router: Router){

    }
    onClick() {
        this.save.emit(this.rowData);

// Here i want to catch this event in other component!!
    }


}