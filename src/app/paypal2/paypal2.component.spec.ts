import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Paypal2Component } from './paypal2.component';

describe('Paypal2Component', () => {
  let component: Paypal2Component;
  let fixture: ComponentFixture<Paypal2Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Paypal2Component]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Paypal2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
