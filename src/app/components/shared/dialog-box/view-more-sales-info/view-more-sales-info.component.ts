import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-view-more-sales-info',
  templateUrl: './view-more-sales-info.component.html',
  styleUrl: './view-more-sales-info.component.css'
})
export class ViewMoreSalesInfoComponent {

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    console.log(data)
  }

}
