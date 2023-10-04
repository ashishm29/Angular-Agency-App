import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchByStoreComponent } from './search-by-store.component';

describe('SearchByStoreComponent', () => {
  let component: SearchByStoreComponent;
  let fixture: ComponentFixture<SearchByStoreComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SearchByStoreComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SearchByStoreComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
