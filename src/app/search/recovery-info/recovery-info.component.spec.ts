import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RecoveryInfoComponent } from './recovery-info.component';

describe('RecoveryInfoComponent', () => {
  let component: RecoveryInfoComponent;
  let fixture: ComponentFixture<RecoveryInfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [RecoveryInfoComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RecoveryInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
