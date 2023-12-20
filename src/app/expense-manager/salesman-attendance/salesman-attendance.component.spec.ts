import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SalesmanAttendanceComponent } from './salesman-attendance.component';

describe('SalesmanSalaryComponent', () => {
  let component: SalesmanAttendanceComponent;
  let fixture: ComponentFixture<SalesmanAttendanceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SalesmanAttendanceComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(SalesmanAttendanceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
