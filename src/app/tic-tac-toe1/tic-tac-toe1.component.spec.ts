import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TicTacToe1Component } from './tic-tac-toe1.component';

describe('TicTacToe1Component', () => {
  let component: TicTacToe1Component;
  let fixture: ComponentFixture<TicTacToe1Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TicTacToe1Component ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TicTacToe1Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
