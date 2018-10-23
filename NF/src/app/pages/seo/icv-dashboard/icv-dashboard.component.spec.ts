import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IcvDashboardComponent } from './icv-dashboard.component';

describe('IcvDashboardComponent', () => {
  let component: IcvDashboardComponent;
  let fixture: ComponentFixture<IcvDashboardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IcvDashboardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IcvDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
