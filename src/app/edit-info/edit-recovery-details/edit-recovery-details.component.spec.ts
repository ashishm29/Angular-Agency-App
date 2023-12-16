import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditRecoveryDetailsComponent } from './edit-recovery-details.component';

describe('EditRecoveryDetailsComponent', () => {
  let component: EditRecoveryDetailsComponent;
  let fixture: ComponentFixture<EditRecoveryDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditRecoveryDetailsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditRecoveryDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
