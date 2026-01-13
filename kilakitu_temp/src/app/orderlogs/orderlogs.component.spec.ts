import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderlogsComponent } from './orderlogs.component';

describe('MyListingComponent', () => {
  let component: OrderlogsComponent;
  let fixture: ComponentFixture<OrderlogsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OrderlogsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OrderlogsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
