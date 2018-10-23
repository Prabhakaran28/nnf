import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UploadBacklinksComponent } from './upload-backlinks.component';

describe('UploadBacklinksComponent', () => {
  let component: UploadBacklinksComponent;
  let fixture: ComponentFixture<UploadBacklinksComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UploadBacklinksComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UploadBacklinksComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
