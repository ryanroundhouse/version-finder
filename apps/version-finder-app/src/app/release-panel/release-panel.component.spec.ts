import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReleasePanelComponent } from './release-panel.component';

describe('ReleasePanelComponent', () => {
  let component: ReleasePanelComponent;
  let fixture: ComponentFixture<ReleasePanelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReleasePanelComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ReleasePanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
