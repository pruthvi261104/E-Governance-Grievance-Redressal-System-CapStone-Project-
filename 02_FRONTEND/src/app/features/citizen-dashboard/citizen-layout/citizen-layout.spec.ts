import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CitizenLayout } from './citizen-layout';

describe('CitizenLayout', () => {
  let component: CitizenLayout;
  let fixture: ComponentFixture<CitizenLayout>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CitizenLayout]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CitizenLayout);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
