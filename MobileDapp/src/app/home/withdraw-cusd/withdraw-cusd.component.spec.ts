import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WithdrawCusdComponent } from './withdraw-cusd.component';

describe('WithdrawCusdComponent', () => {
  let component: WithdrawCusdComponent;
  let fixture: ComponentFixture<WithdrawCusdComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WithdrawCusdComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WithdrawCusdComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
