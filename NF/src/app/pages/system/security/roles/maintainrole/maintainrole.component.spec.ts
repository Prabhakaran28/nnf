import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MaintainroleComponent } from './maintainrole.component';

describe('MaintainroleComponent', () => {
  let component: MaintainroleComponent;
  let fixture: ComponentFixture<MaintainroleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MaintainroleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MaintainroleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
