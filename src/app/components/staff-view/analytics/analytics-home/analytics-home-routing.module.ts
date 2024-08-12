import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AnalyticsHomeComponent } from './analytics-home.component';
import { SalesAnalyticsComponent } from '../sales-analytics/sales-analytics.component';
import { MarketingAnalyticsComponent } from '../marketing-analytics/marketing-analytics.component';

const routes: Routes = [
  {
    path: '',
    component: AnalyticsHomeComponent,
    children: [
      { path: 'sales', component: SalesAnalyticsComponent },
      { path: 'marketing', component: MarketingAnalyticsComponent}
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AnalyticsHomeRoutingModule { }
