import { Component, OnInit, group } from '@angular/core';
import { NbMenuItem } from '@nebular/theme';
//import { MENU_ITEMS } from './pages-menu';
import { NbMenuService } from '@nebular/theme'
import * as decode from 'jwt-decode';
import { HttpClientService } from '../common/http/services/httpclient.service';


@Component({
  selector: 'ngx-pages',
  template: `
  
    <ngx-sample-layout >
    <!-- <nb-menu *ngIf="rroute.canActivate('Admin')" [items]="menu"></nb-menu> -->
      <nb-menu [items]="menu"></nb-menu> 
      <router-outlet></router-outlet>
    </ngx-sample-layout>
    
  `,
})


export class PagesComponent implements OnInit {

  menu: NbMenuItem[];

  menu1: NbMenuItem[];
  mmenu: NbMenuItem[];
  child: NbMenuItem[];
  group: NbMenuItem;
  returnValue: boolean;
  returnSecValue: boolean;
  returnProdValue: boolean;
  groupMod: any;
  token_Payload = this.httpSvc.decodeToken(localStorage.getItem('auth_app_token'));

  //import {  HttpClientService } from '../common/http/services/httpclient.service'; 
  HTTPActivity: boolean;
  constructor(private menuService: NbMenuService, private httpSvc: HttpClientService) {
  }

  ngOnInit(): void {

    //this.menu = this.getModules();
    this.menu = this.loadModules();
    //console.log("menu Items => " + JSON.stringify(this.menu));
  }

  private loadModules(): NbMenuItem[] {
    this.menu = [];
    this.groupMod = [];

    if (this.isGroup()) {

    }
    this.token_Payload.module.forEach(element => {
      this.menu.push({ title: element[0], link: element[1]}, )
    });


    this.token_Payload.module.forEach(element => {
      this.groupMod.push(element[2]);
    });

    this.groupMod = this.groupMod.filter((el, i, a) => i === a.indexOf(el))

    //this.token_Payload.module.forEach(element => {

    //this.mmenu = {
    //title: element[0], 
    // link: element[1], 
    //children: this.getChildren(element[2])
    //}
    // });

    this.mmenu = [];

    this.mmenu.push({
      title: 'Dashboard',
      icon: 'nb-home',
      link: '/pages/dashboard',
      home: true,
    }, )

    for (var i = 0; i < this.groupMod.length; i++) {
      this.mmenu.push(this.getGroup(this.groupMod[i]), {
        title: this.groupMod[i],
        icon: 'nb-compose',
        children: this.getChildren(this.groupMod[i])
      }, )

    }
    //console.log("menu Items => " + JSON.stringify(this.menu));
    //console.log("Unique is => " + this.groupMod);
    //console.log("actual menu built  is => " + JSON.stringify(this.mmenu));
    return this.mmenu;
  }

  getGroup(groupName): NbMenuItem {

    if (groupName === "Security") {
      this.group = {
        title: 'Admin',
        group: true,
      }
    } else if (groupName === "On-Board") {
      this.group = {
        title: 'HRMS',
        group: true,
      }
    } else {
      this.group = {title: '', hidden: true}
    }

    return this.group;

  }

  getChildren(parentMod): NbMenuItem[] {
    this.child = [];
    this.token_Payload.module.forEach(element => {

      if (parentMod === element[2]) {
        this.child.push({
          title: element[0],
          link: element[1],
        },)
      }
    });
    return this.child;
  }

  getModules(): NbMenuItem[] {

    this.menu = [
      {
        title: 'Dashboard',
        icon: 'nb-home',
        link: '/pages/dashboard',
        home: true,
      },
      {
        title: 'HRMS',
        group: true,
      }, {
        title: 'On-Board',
        icon: 'nb-compose',
        children: [
          {
            title: 'Employee Details',
            link: '/pages/hrms/onboard',
          }
        ],
      },
    ];
    if (this.isGroup()) {
      this.menu.push({
        title: 'SYSTEM CONFIGURATION',
        group: true,
      }, )
    }
    if (this.hasProduct()) {
      this.menu.push(this.loadProductModules(), )
    }
    if (this.hasSecurity()) {
      this.menu.push(this.loadSecurityModules(), )
    }

    return this.menu
  }


  private isGroup(): boolean {
    this.token_Payload.module.forEach(element => {
      element.forEach(element => {
        if (element == 'Auto Sequence' || element == 'Roles'
          || element == 'Modules' || element == 'Users' || element == 'Meta Data')
          this.returnValue = true;
      });
    });
    return this.returnValue;
  }

  private hasSecurity(): boolean {
    this.token_Payload.module.forEach(element => {
      element.forEach(element => {
        if (element == 'Roles'
          || element == 'Modules' || element == 'Users')
          this.returnSecValue = true;
      });
    });
    return this.returnSecValue;
  }

  private hasProduct(): boolean {
    this.token_Payload.module.forEach(element => {
      element.forEach(element => {
        if (element == 'Auto Sequence'|| element == 'Meta Data')
          this.returnProdValue = true;
      });
    });
    return this.returnProdValue;
  }







  private loadSecurityModules(): NbMenuItem {

    for (let i = 0; i < this.token_Payload.module.length; i++) {
      let tempParentTitle = this.token_Payload.module[i];
      let tempTitle = this.token_Payload.module[i][2];



      for (let j = 0; j < this.token_Payload.module[i].length; j++) {
        if (tempTitle == this.token_Payload.module[i][j]) {

        }
        else { break; }

      }
      // tempParentTitle.forEach(element => {
      //   console.log("element"+element);
      // });
    }

    return {
      title: 'Security',
      icon: 'nb-compose',
      //hidden: !this.isAdmin(),
      children: [
        {
          title: 'Roles',
          link: '/pages/system/role',
        },
        {
          title: 'Modules',
          link: '/pages/system/modules',
        },
        {
          title: 'Users',
          link: '/pages/system/users',
        }
      ]
    };
  }


  private loadProductModules(): NbMenuItem {

    for (let i = 0; i < this.token_Payload.module.length; i++) {
      let tempParentTitle = this.token_Payload.module[i];
      let tempTitle = this.token_Payload.module[i][2];



      for (let j = 0; j < this.token_Payload.module[i].length; j++) {
        if (tempTitle == this.token_Payload.module[i][j]) {

        }
        else { break; }

      }
      // tempParentTitle.forEach(element => {
      //   console.log("element"+element);
      // });
    }

    return {
      title: 'Product Setup test',
      icon: 'nb-compose',
      children: [
        {
          title: 'Auto Sequence Pradeep',
          link: '/pages/system/productsetup/autosequence',
        },
        {
          title: 'Meta Data',
          link: '/pages/system/productsetup/metadata',
        }
      ],
    };
  }


  private containsProduct(element, index, array): boolean {
    element.forEach(element => {
      //console.log("inside arry" + element);
    });
    return true;
  }

  private displayProduct(): NbMenuItem {
    if (this.token_Payload.module.some(this.containsProduct)) {
      return {
        title: 'Product Setup test',
        icon: 'nb-compose',
        children: [
          {
            title: 'Auto Sequence Pradeep',
            link: '/pages/system/productsetup/autosequence',
          },
          {
            title: 'Meta Data',
            link: '/pages/system/productsetup/metadata',
          },
        ],
      };
    }
  }

  private containsSecurity(element, index, array): boolean {
    return (element.MODULE == 'Roles');
  }

  public displaySecurity(): NbMenuItem {
    if (this.token_Payload.module.some(this.containsSecurity)) {
      return {
        title: 'Security',
        icon: 'nb-compose',
        //hidden: !this.isAdmin(),
        children: [
          {
            title: 'Roles',
            link: '/pages/system/role',
          },
          {
            title: 'Modules',
            link: '/pages/system/modules',
          },
          {
            title: 'Users',
            link: '/pages/system/users',
          }
        ]
      }

    }


    //for (var j in this.token_Payload.module) {
    //  console.log("value is " + this.token_Payload.module[j]);
    // }

  }



  private Dashboard(): NbMenuItem {
    return {
      title: 'Dashboard',
      icon: 'nb-home',
      link: '/pages/dashboard',
      home: true,
    };
  }

  // private frame1(): NbMenuItem {
  //   return {
  //     title: 'Dashboard1',
  //     icon: 'nb-home',
  //     link: '/pages/dashboard1',
  //   };
  // }

  // isAdmin(): boolean {
  //   if ("a"==="a") {
  //     return true;
  //   } else 
  //   return false;
  // }

  // checkRole(){

  //   this.token_Payload.module.some(this.containsSecurity)

  // }

  // frameModule(): NbMenuItem {
  //   return {
  //     title: 'Dashboard1',
  //     icon: 'nb-home',
  //     link: '/pages/dashboard1',
  //   };

  // }

}




