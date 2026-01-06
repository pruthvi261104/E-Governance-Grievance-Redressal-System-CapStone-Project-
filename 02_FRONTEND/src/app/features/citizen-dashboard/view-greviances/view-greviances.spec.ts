import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewGreviances } from './view-greviances';

describe('ViewGreviances', () => {
  let component: ViewGreviances;
  let fixture: ComponentFixture<ViewGreviances>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ViewGreviances]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViewGreviances);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
