import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SmartableServicecolumnComponent } from './smartable-servicecolumn.component';

describe('SmartableServicecolumnComponent', () => {
  let component: SmartableServicecolumnComponent;
  let fixture: ComponentFixture<SmartableServicecolumnComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SmartableServicecolumnComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SmartableServicecolumnComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
