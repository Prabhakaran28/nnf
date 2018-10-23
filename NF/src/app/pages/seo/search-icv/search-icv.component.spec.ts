import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchIcvComponent } from './search-icv.component';

describe('SearchIcvComponent', () => {
  let component: SearchIcvComponent;
  let fixture: ComponentFixture<SearchIcvComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SearchIcvComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SearchIcvComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
