import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SaleBookComponent } from './sale-book.component';

describe('SaleBookComponent', () => {
  let component: SaleBookComponent;
  let fixture: ComponentFixture<SaleBookComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SaleBookComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SaleBookComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
