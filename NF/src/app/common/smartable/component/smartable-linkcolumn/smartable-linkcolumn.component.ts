import { Cell, DefaultEditor, Editor,ViewCell } from 'ng2-smart-table';
import { Component, Input, OnInit } from '@angular/core';
import { LinkElement } from '../../model/linkelement.model';

@Component({
  template: `
    <a *ngFor="let linkparam of linkparams" [routerLink]="linkparam.link" [queryParams]="linkparam.linkparam" routerLinkActive="active">
    {{linkparam.linkname}}
  </a>
  `,
})

export class SmartableLinkcolumnComponent extends DefaultEditor implements ViewCell, OnInit {
  @Input() value: string;
  @Input() rowData: any;
  
  le = new LinkElement();
  linkparams = [this.le];
  ngOnInit() {
    var string = JSON.stringify(this.value);
    var json:LinkElement = JSON.parse(string);
    this.le.link = json.link.toString();
    this.le.linkname = json.linkname.toString();
    this.le.linkparam = json.linkparam;
    };
}

