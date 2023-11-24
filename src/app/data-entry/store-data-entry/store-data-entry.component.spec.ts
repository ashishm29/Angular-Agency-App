import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StoreDataEntryComponent } from './store-data-entry.component';

describe('StoreDataEntryComponent', () => {
  let component: StoreDataEntryComponent;
  let fixture: ComponentFixture<StoreDataEntryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StoreDataEntryComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StoreDataEntryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
