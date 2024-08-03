import { Component } from '@angular/core';

@Component({
  selector: 'app-leave-management',
  templateUrl: './leave-management.component.html',
  styleUrl: './leave-management.component.css'
})
export class LeaveManagementComponent {
  managementPages = [
    {name: 'Leave' , href: `leave`},
    {name: 'Attendence', href: "attendence"} ,
  ]
}
