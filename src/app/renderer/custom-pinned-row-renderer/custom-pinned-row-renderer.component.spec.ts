import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomPinnedRowRendererComponent } from './custom-pinned-row-renderer.component';

describe('CustomPinnedRowRendererComponent', () => {
  let component: CustomPinnedRowRendererComponent;
  let fixture: ComponentFixture<CustomPinnedRowRendererComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CustomPinnedRowRendererComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CustomPinnedRowRendererComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
