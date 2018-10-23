import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SeoDashboardComponent } from './seo-dashboard.component';

describe('SeoDashboardComponent', () => {
  let component: SeoDashboardComponent;
  let fixture: ComponentFixture<SeoDashboardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SeoDashboardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SeoDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
