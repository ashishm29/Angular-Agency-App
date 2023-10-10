import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeleteInfoComponent } from './delete-info.component';

describe('DeleteInfoComponent', () => {
  let component: DeleteInfoComponent;
  let fixture: ComponentFixture<DeleteInfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DeleteInfoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DeleteInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
