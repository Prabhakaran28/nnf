import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SeoDisavowComponent } from './seo-disavow.component';

describe('SeoDisavowComponent', () => {
  let component: SeoDisavowComponent;
  let fixture: ComponentFixture<SeoDisavowComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SeoDisavowComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SeoDisavowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
