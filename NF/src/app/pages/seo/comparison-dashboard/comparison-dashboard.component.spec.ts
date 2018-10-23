import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ComparisonDashboardComponent } from './comparison-dashboard.component';

describe('ComparisonDashboardComponent', () => {
  let component: ComparisonDashboardComponent;
  let fixture: ComponentFixture<ComparisonDashboardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ComparisonDashboardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ComparisonDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
