import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AnalyticsHomeRoutingModule } from './analytics-home-routing.module';
import { AnalyticsHomeComponent } from './analytics-home.component';
import { MatTabsModule } from '@angular/material/tabs';


@NgModule({
  declarations: [AnalyticsHomeComponent],
  imports: [
    CommonModule,
    AnalyticsHomeRoutingModule,
    MatTabsModule
  ]
})
export class AnalyticsHomeModule { }
