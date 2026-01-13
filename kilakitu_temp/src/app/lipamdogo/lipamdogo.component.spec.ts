import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LipamdogoComponent } from './lipamdogo.component';

describe('MyListingComponent', () => {
  let component: LipamdogoComponent;
  let fixture: ComponentFixture<LipamdogoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LipamdogoComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LipamdogoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
