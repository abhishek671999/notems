import { Injectable } from "@angular/core";
import { dateUtils } from "./date_utils";
import { meAPIUtility } from "../site-variables";
import { lineItems, sale } from "../custom_dtypes/sales";


@Injectable({
    providedIn: 'root'
  })
export class ReceiptPrintFormatter{

    constructor(
        private meUtility: meAPIUtility, 
        private dateUtils: dateUtils
    ){

    }

    private _printObj!: sale

    set printObj(printObj: sale){
      this._printObj = printObj
    }

    public getReciptPrintObjects(){
      console.log(this._printObj)
      let sectionSeperatorCharacters = '-'.repeat(30);
      let tableHeader = '    ITEM       QTY  RATE   AMT';
      let printObj = [
        {
          text: this.getFormattedReceiptDetails(),
          justification: 'left',
        },
        {
          text: sectionSeperatorCharacters,
          justification: 'center',
        },
        {
          text: tableHeader
        },
        {
          text: this.getFormattedItemDetails(this._printObj.line_items),
        },
      ];
      return printObj
    }

    private getFormattedReceiptDetails(){
      let customer = 'Customer Name: ' + this._printObj.customer
      let totalAmount = 'Total amount: ' + this._printObj.total_amount
      let discount = 'Discount: ' + this._printObj.discount
      let receivedAmount = 'Received amount: ' + this._printObj.received_amount
      let createdOn = 'Created on: ' + this._printObj.recorded_at
      let createdBy = 'Created by: ' + this._printObj.recorded_by
      let formattedString = `${customer}\n${totalAmount}\n${discount}\n${receivedAmount}\n${createdOn}\n${createdBy}`
      return formattedString
    }

    private getFormattedItemDetails(itemList: lineItems[]) {
      let formattedTable = '';
      itemList.forEach((lineItem: lineItems, index) => {
      if (lineItem.quantity > 0) {
        let trimmedName = this.getFixedLengthString(
            lineItem.item_name.substring(0, 14),
          14,
          false,
          ' '
        );
        let remainingName =
          trimmedName.trim() == lineItem.item_name
            ? ''
            : ' ' +
              this.getFixedLengthString(
                lineItem.item_name.substring(15, 48),
                30,
                false,
                ' '
              ) +
              '\n';
        let itemQty = this.getFixedLengthString(lineItem.quantity, 3, true, ' ');
        let itemPrice = this.getFixedLengthString(lineItem.price, 4, true, ' ');
        let itemAmount = this.getFixedLengthString(
            lineItem.quantity * lineItem.price,
          4,
          true,
          ' '
        );
        formattedTable += `${index + 1} ${trimmedName}  ${itemQty}  ${itemPrice}  ${itemAmount}\n${remainingName}`;
      }
    });
    return formattedTable;
    }

    private getFixedLengthString(string: string | number, length: number, prefix = true, fixValue = '0') {
      string = String(string);
      console.log('string length', string.toLocaleString().length);
      return string.length > length
        ? string.substring(0, length)
        : prefix
        ? fixValue.repeat(length - string.length) + string
        : string + fixValue.repeat(length - string.length);
    }


}