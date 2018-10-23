import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VisiblelinkDashboardComponent } from './visiblelink-dashboard.component';

describe('VisiblelinkDashboardComponent', () => {
  let component: VisiblelinkDashboardComponent;
  let fixture: ComponentFixture<VisiblelinkDashboardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VisiblelinkDashboardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VisiblelinkDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
