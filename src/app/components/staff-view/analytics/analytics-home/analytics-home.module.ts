import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AnalyticsHomeRoutingModule } from './analytics-home-routing.module';
import { AnalyticsHomeComponent } from './analytics-home.component';


@NgModule({
  declarations: [AnalyticsHomeComponent],
  imports: [
    CommonModule,
    AnalyticsHomeRoutingModule
  ]
})
export class AnalyticsHomeModule { }
