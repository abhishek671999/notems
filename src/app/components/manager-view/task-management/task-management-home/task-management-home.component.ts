import { Component } from '@angular/core';

@Component({
  selector: 'app-task-management-home',
  templateUrl: './task-management-home.component.html',
  styleUrl: './task-management-home.component.css'
})
export class TaskManagementHomeComponent {
  managementPages = [
    {name: 'Board' , href: `tasks`},
    {name: 'Beats', href: "beats"} ,

   
  ]
}
