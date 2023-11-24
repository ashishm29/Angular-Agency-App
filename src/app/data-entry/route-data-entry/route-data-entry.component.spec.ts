import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RouteDataEntryComponent } from './route-data-entry.component';

describe('RouteDataEntryComponent', () => {
  let component: RouteDataEntryComponent;
  let fixture: ComponentFixture<RouteDataEntryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RouteDataEntryComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RouteDataEntryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
