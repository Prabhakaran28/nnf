import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AutosequenceComponent } from './autosequence.component';

describe('AutosequenceComponent', () => {
  let component: AutosequenceComponent;
  let fixture: ComponentFixture<AutosequenceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AutosequenceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AutosequenceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
