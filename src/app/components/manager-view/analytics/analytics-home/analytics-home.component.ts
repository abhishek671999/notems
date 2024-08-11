import { Component } from '@angular/core';

@Component({
  selector: 'app-analytics-home',
  templateUrl: './analytics-home.component.html',
  styleUrl: './analytics-home.component.css'
})
export class AnalyticsHomeComponent {
  managementPages = [
    {name: 'Sales Analytics' , href: `sales`},
    {name: 'Marketing Analytics', href: "marketing"} ,
  ]
}
