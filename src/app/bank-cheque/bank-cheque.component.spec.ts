import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BankChequeComponent } from './bank-cheque.component';

describe('BankChequeComponent', () => {
  let component: BankChequeComponent;
  let fixture: ComponentFixture<BankChequeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BankChequeComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BankChequeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
