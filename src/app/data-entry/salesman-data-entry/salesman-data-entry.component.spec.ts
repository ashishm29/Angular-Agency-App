import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SalesmanDataEntryComponent } from './salesman-data-entry.component';

describe('SalesmanDataEntryComponent', () => {
  let component: SalesmanDataEntryComponent;
  let fixture: ComponentFixture<SalesmanDataEntryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SalesmanDataEntryComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SalesmanDataEntryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
