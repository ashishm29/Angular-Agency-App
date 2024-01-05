import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RecoveryFromSalesmanComponent } from './recovery-from-salesman.component';

describe('RecoveryFromSalesmanComponent', () => {
  let component: RecoveryFromSalesmanComponent;
  let fixture: ComponentFixture<RecoveryFromSalesmanComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RecoveryFromSalesmanComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RecoveryFromSalesmanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
