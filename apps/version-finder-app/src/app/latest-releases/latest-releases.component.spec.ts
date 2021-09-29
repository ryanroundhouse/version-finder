import { HttpClientModule } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LatestReleasesComponent } from './latest-releases.component';

describe('TestComponentComponent', () => {
  let component: LatestReleasesComponent;
  let fixture: ComponentFixture<LatestReleasesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LatestReleasesComponent],
      imports: [HttpClientModule],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LatestReleasesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
