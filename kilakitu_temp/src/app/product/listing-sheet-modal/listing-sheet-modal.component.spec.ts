import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListingSheetModalComponent } from './listing-sheet-modal.component';

describe('ClientModalComponent', () => {
  let component: ListingSheetModalComponent;
  let fixture: ComponentFixture<ListingSheetModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListingSheetModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListingSheetModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
