import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportLayout } from './report-layout';

describe('ReportLayout', () => {
  let component: ReportLayout;
  let fixture: ComponentFixture<ReportLayout>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReportLayout]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReportLayout);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
