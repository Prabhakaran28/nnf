import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchBacklinkComponent } from './search-backlink.component';

describe('SearchBacklinkComponent', () => {
  let component: SearchBacklinkComponent;
  let fixture: ComponentFixture<SearchBacklinkComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SearchBacklinkComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SearchBacklinkComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
