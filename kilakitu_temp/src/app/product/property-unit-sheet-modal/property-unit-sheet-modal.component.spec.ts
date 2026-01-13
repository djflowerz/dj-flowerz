import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PropertyUnitSheetModalComponent } from './property-unit-sheet-modal.component';

describe('ClientModalComponent', () => {
  let component: PropertyUnitSheetModalComponent;
  let fixture: ComponentFixture<PropertyUnitSheetModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PropertyUnitSheetModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PropertyUnitSheetModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
