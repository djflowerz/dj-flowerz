import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditListingSheetModalComponent } from './edit-listing-sheet-modal.component';

describe('ClientModalComponent', () => {
  let component: EditListingSheetModalComponent;
  let fixture: ComponentFixture<EditListingSheetModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditListingSheetModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditListingSheetModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
