import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditStoreDetailsComponent } from './edit-store-details.component';

describe('EditStoreDetailsComponent', () => {
  let component: EditStoreDetailsComponent;
  let fixture: ComponentFixture<EditStoreDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditStoreDetailsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditStoreDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
