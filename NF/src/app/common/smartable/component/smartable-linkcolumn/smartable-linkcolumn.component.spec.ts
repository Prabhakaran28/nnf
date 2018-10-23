import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SmartableLinkcolumnComponent } from './smartable-linkcolumn.component';

describe('SmartableLinkcolumnComponent', () => {
  let component: SmartableLinkcolumnComponent;
  let fixture: ComponentFixture<SmartableLinkcolumnComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SmartableLinkcolumnComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SmartableLinkcolumnComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
