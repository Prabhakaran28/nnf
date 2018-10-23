import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DisavowDashboardComponent } from './disavow-dashboard.component';

describe('DisavowDashboardComponent', () => {
  let component: DisavowDashboardComponent;
  let fixture: ComponentFixture<DisavowDashboardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DisavowDashboardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DisavowDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
