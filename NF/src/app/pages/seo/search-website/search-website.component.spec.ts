import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchWebsiteComponent } from './search-website.component';

describe('SearchWebsiteComponent', () => {
  let component: SearchWebsiteComponent;
  let fixture: ComponentFixture<SearchWebsiteComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SearchWebsiteComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SearchWebsiteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
