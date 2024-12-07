import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { host } from '../../site-variables';
import { addItem, deleteItem, editItem, updateTeamItem } from '../../custom_dtypes/items';

@Injectable({
  providedIn: 'root'
})
export class ItemsService {

  private addItemEndpoint = host + 'sales/add_item/'
  private editItemEndpoint = host + 'sales/edit_item/'
  private getItemEndpoint = host + 'sales/get_items/'
  private deleteItemEndpoint = host + 'sales/delete_item/'
  private updateTeamItemInventoryEndpoint = host + 'sales/update_team_item_inventory/'

  constructor(private httpClient: HttpClient) { }

  addItems(body: addItem) {
    return this.httpClient.post(this.addItemEndpoint, body)
  }

  editItems(body: editItem) {
    return this.httpClient.post(this.editItemEndpoint, body)
  }

  getItems(httpParams: HttpParams) {
    return this.httpClient.get(this.getItemEndpoint, {params: httpParams})
  }

  deleteItems(body: deleteItem) {
    return this.httpClient.delete(this.deleteItemEndpoint, {body: body})
  }

  updateTeamItemInventory(body: updateTeamItem){
    return this.httpClient.post(this.updateTeamItemInventoryEndpoint, body)
  }

}
