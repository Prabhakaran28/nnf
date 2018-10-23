import { Component, OnInit } from '@angular/core';


@Component({
  selector: 'seo',
  template: `
    <router-outlet></router-outlet>
  `,
})
export class SeoComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
