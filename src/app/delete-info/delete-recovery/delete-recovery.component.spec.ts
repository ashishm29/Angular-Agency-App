import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeleteRecoveryComponent } from './delete-recovery.component';

describe('DeleteRecoveryComponent', () => {
  let component: DeleteRecoveryComponent;
  let fixture: ComponentFixture<DeleteRecoveryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DeleteRecoveryComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DeleteRecoveryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
