import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SeoTeamDashboardComponent } from './seo-team-dashboard.component';

describe('SeoTeamDashboardComponent', () => {
  let component: SeoTeamDashboardComponent;
  let fixture: ComponentFixture<SeoTeamDashboardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SeoTeamDashboardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SeoTeamDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
