import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { ViewImageComponent } from '../view-image/view-image.component';

@Component({
  selector: 'app-view-more-sales-info',
  templateUrl: './view-more-sales-info.component.html',
  styleUrl: './view-more-sales-info.component.css'
})
export class ViewMoreSalesInfoComponent {

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private matDialog: MatDialog
  ) {
    console.log(data)
  }

  openImage(title: string, url: string){
    this.matDialog.open(ViewImageComponent, {data: {title: title, url: url}})
  }
}
