import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BacklinkBatchComponent } from './backlink-batch.component';

describe('BacklinkBatchComponent', () => {
  let component: BacklinkBatchComponent;
  let fixture: ComponentFixture<BacklinkBatchComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BacklinkBatchComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BacklinkBatchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
