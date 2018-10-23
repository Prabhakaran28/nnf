import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SeoResourceDashboardComponent } from './seo-resource-dashboard.component';

describe('SeoResourceDashboardComponent', () => {
  let component: SeoResourceDashboardComponent;
  let fixture: ComponentFixture<SeoResourceDashboardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SeoResourceDashboardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SeoResourceDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
