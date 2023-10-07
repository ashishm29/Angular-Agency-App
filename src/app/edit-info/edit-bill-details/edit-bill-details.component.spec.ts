import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditBillDetailsComponent } from './edit-bill-details.component';

describe('EditBillDetailsComponent', () => {
  let component: EditBillDetailsComponent;
  let fixture: ComponentFixture<EditBillDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditBillDetailsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditBillDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
