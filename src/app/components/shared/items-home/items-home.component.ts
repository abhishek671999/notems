import { Component } from '@angular/core';

@Component({
  selector: 'app-items-home',
  templateUrl: './items-home.component.html',
  styleUrl: './items-home.component.css'
})
export class ItemsHomeComponent {
  managementPages = [
    {name: 'Items' , href: `items`},
    {name: 'Distributor', href: "distributor-items"},
  ]
}
