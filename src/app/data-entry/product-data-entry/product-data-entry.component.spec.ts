import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductDataEntryComponent } from './product-data-entry.component';

describe('ProductDataEntryComponent', () => {
  let component: ProductDataEntryComponent;
  let fixture: ComponentFixture<ProductDataEntryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProductDataEntryComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProductDataEntryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
