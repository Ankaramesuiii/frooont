import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MissionModalComponent } from './mission-modal.component';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';

describe('MissionModalComponent', () => {
  let component: MissionModalComponent;
  let fixture: ComponentFixture<MissionModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MissionModalComponent],
      providers: [provideHttpClient(), // Provide the HttpClient along with HttpClientTesting
              provideHttpClientTesting()]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MissionModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
