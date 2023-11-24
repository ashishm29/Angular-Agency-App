import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BillDataEntryComponent } from './bill-data-entry.component';

describe('BillDataEntryComponent', () => {
  let component: BillDataEntryComponent;
  let fixture: ComponentFixture<BillDataEntryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BillDataEntryComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BillDataEntryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
