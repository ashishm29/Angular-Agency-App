import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AgGridMenuRendererComponent } from './ag-grid-menu-renderer.component';

describe('AgGridMenuRendererComponent', () => {
  let component: AgGridMenuRendererComponent;
  let fixture: ComponentFixture<AgGridMenuRendererComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AgGridMenuRendererComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AgGridMenuRendererComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
