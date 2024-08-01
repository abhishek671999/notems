import { NgModule } from '@angular/core';
import { meAPIUtility, Utility } from './shared/site-variables';
import { RouterModule, RouterOutlet } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AppRoutingModule, routingComponents } from './app.routes';
import { CommonModule } from '@angular/common';

@NgModule({
  declarations: [
    routingComponents,
  ],
  imports: [
      RouterOutlet,
      FormsModule,
      ReactiveFormsModule,
      RouterModule,
    AppRoutingModule,
    CommonModule
    ],
  providers: [Utility, meAPIUtility],
  bootstrap: [],
})
export class AppModule {}
