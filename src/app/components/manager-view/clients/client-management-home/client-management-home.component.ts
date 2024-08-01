import { Component } from '@angular/core';

@Component({
  selector: 'app-client-management-home',
  templateUrl: './client-management-home.component.html',
  styleUrl: './client-management-home.component.css'
})
export class ClientManagementHomeComponent {

  managementPages = [
    {name: 'Customer' , href: `customers`},
    {name: 'Prospect', href: "prospects"}    
  ]

}
