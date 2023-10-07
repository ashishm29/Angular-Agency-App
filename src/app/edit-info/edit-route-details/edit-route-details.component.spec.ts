import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditRouteDetailsComponent } from './edit-route-details.component';

describe('EditRouteDetailsComponent', () => {
  let component: EditRouteDetailsComponent;
  let fixture: ComponentFixture<EditRouteDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditRouteDetailsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditRouteDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
