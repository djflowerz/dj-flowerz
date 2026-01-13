import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FiltersNavbarComponent } from './filters-navbar.component';

describe('FiltersNavbarComponent', () => {
  let component: FiltersNavbarComponent;
  let fixture: ComponentFixture<FiltersNavbarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FiltersNavbarComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FiltersNavbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
