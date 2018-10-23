import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VisibleBacklinksComponent } from './visible-backlinks.component';

describe('VisibleBacklinksComponent', () => {
  let component: VisibleBacklinksComponent;
  let fixture: ComponentFixture<VisibleBacklinksComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VisibleBacklinksComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VisibleBacklinksComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
