import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import {TicTacToeComponent1} from "./tic-tac-toe1/tic-tac-toe1.component";

@NgModule({
  declarations: [
    AppComponent,
    TicTacToeComponent1
  ],
  imports: [
    BrowserModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
