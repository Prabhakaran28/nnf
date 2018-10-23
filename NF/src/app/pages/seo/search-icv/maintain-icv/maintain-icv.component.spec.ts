import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MaintainIcvComponent } from './maintain-icv.component';

describe('MaintainIcvComponent', () => {
  let component: MaintainIcvComponent;
  let fixture: ComponentFixture<MaintainIcvComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MaintainIcvComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MaintainIcvComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
