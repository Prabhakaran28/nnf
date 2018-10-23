import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreatedBacklinksComponent } from './created-backlinks.component';

describe('CreatedBacklinksComponent', () => {
  let component: CreatedBacklinksComponent;
  let fixture: ComponentFixture<CreatedBacklinksComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreatedBacklinksComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreatedBacklinksComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
