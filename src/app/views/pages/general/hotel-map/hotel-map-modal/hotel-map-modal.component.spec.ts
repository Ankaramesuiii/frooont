import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HotelMapModalComponent } from './hotel-map-modal.component';

describe('HotelMapModalComponent', () => {
  let component: HotelMapModalComponent;
  let fixture: ComponentFixture<HotelMapModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HotelMapModalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HotelMapModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
