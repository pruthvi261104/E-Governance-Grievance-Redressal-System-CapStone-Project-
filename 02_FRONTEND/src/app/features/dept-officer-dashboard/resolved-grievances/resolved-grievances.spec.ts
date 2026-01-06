import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResolvedGrievances } from './resolved-grievances';

describe('ResolvedGrievances', () => {
  let component: ResolvedGrievances;
  let fixture: ComponentFixture<ResolvedGrievances>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ResolvedGrievances]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ResolvedGrievances);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
