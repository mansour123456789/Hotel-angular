import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AuthhComponent } from './authh.component';

describe('AuthhComponent', () => {
  let component: AuthhComponent;
  let fixture: ComponentFixture<AuthhComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AuthhComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AuthhComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
