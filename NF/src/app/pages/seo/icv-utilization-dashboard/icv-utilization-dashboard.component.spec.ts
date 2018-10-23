import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IcvUtilizationDashboardComponent } from './icv-utilization-dashboard.component';

describe('IcvUtilizationDashboardComponent', () => {
  let component: IcvUtilizationDashboardComponent;
  let fixture: ComponentFixture<IcvUtilizationDashboardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IcvUtilizationDashboardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IcvUtilizationDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
