import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { lineItems } from '../../../../shared/custom_dtypes/sales';

@Component({
  selector: 'app-sales-more-info',
  templateUrl: './sales-more-info.component.html',
  styleUrl: './sales-more-info.component.css'
})
export class SalesMoreInfoComponent {

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any
  ){
    console.log(data)
    this.lineItemsSource = data.line_items
  }

  public lineItemsSource: lineItems[] = []
  public lineItemColumns: string[] = ['sl_no', 'item_name', 'category_name', 'quantity', 'price', 'unit_price']

  ngOnInit(){

  }

  trwtwrtwrtwopenImageInNewTab(image_url: string){
    window.open(image_url, '_blank')
  }
}
