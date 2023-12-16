import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SalesmanSalaryComponent } from './salesman-salary.component';

describe('SalesmanSalaryComponent', () => {
  let component: SalesmanSalaryComponent;
  let fixture: ComponentFixture<SalesmanSalaryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SalesmanSalaryComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SalesmanSalaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
