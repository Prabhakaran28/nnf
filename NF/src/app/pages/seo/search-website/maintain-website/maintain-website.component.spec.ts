import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MaintainWebsiteComponent } from './maintain-website.component';

describe('MaintainWebsiteComponent', () => {
  let component: MaintainWebsiteComponent;
  let fixture: ComponentFixture<MaintainWebsiteComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MaintainWebsiteComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MaintainWebsiteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
