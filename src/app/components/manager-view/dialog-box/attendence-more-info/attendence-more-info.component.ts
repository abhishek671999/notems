import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-attendence-more-info',
  templateUrl: './attendence-more-info.component.html',
  styleUrl: './attendence-more-info.component.css'
})
export class AttendenceMoreInfoComponent {
  
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any
  ){
    console.log(data)
  }



}
