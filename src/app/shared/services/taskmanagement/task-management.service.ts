import { Injectable } from '@angular/core';
import { host } from '../../site-variables';
import { HttpClient, HttpParams } from '@angular/common/http';
import { addBeat, addTask, assignBeat, deleteBeat, deleteSaleInvoice, deleteSaleInvoiceLineItem, deleteTask, editBeat, editSaleInvoiceHeader, editTask, unassignBeat, updateSalesInvoiceLineItem } from '../../custom_dtypes/tasks';


@Injectable({
  providedIn: 'root'
})
export class TaskManagementService {

  private addBeatEndpoint = host + 'tasks/add_beat/'
  private editBeatEndpoint = host + 'tasks/edit_beat/'
  private deleteBeatEndpoint = host + 'tasks/delete_beat/'
  private getAllBeatsEndpoint = host + 'tasks/get_all_beats/'
  private getDailyBeatsEndpoint = host + 'tasks/get_daily_beats/'


  private addTaskEndpoint = host + 'tasks/add_task/'
  private editTaskEndpoint = host + 'tasks/edit_task/'
  private deleteTaskEndpoint = host + 'tasks/delete_task/'
  private getTasksEndpoint = host + 'tasks/get_tasks/'

  private addSaleEndpoint = host + 'sales/add_sale_invoice/'
  private getSalesEndpoint = host + 'sales/get_sale_invoices/'
  private editSaleInvoiceHeaderEndpoint = host + 'sales/edit_sale_invoice_header/'
  private deleteSalesInvoiceEndpoint = host + 'sales/delete_sale_invoice/'
  
  private updateSaleInvoiceLineItemEndpoint = host + 'sales/update_sale_invoice_line_items/'
  private deleteSalesInvoiceLineItemEndpoint = host + 'sales/delete_sale_invoice_line_item/'


  private assignBeatEndpoint = host + 'tasks/assign_beat/'
  private unassignBeatEndpoint = host + 'tasks/unassign_beat/'

  constructor(private httpClient: HttpClient) { }

  deleteSaleInvoiceLineItem(body: deleteSaleInvoiceLineItem) {
    return this.httpClient.delete(this.deleteSalesInvoiceLineItemEndpoint, {body: body})
  }

  updateSaleInvoiceLineItem(body: updateSalesInvoiceLineItem) {
    return this.httpClient.post(this.updateSaleInvoiceLineItemEndpoint, body)
  }

  deleteSalesInvoice(body: deleteSaleInvoice ) {
    return this.httpClient.delete(this.deleteSalesInvoiceEndpoint, {body: body})
  }

  editSaleInvoiceHeader(body: editSaleInvoiceHeader) {
   return this.httpClient.post(this.editSaleInvoiceHeaderEndpoint, body) 
  }

  addSale(body: any) {
    return this.httpClient.post(this.addSaleEndpoint, body)
  }

  getSales(body: any) {
    return this.httpClient.post(this.getSalesEndpoint, body)
  }

  addBeat(body: addBeat) {
    return this.httpClient.post(this.addBeatEndpoint, body)
  }

  editBeat(body: editBeat) {
    return this.httpClient.post(this.editBeatEndpoint, body)
  }

  deleteBeat(body: deleteBeat) {
    return this.httpClient.delete(this.deleteBeatEndpoint, {body: body})
  }

  getBeats(httpParams: HttpParams) {
    return this.httpClient.get(this.getAllBeatsEndpoint, {params: httpParams})
  }

  getDailyBeats(httpParams: HttpParams) {
    return this.httpClient.get(this.getDailyBeatsEndpoint, {params: httpParams})
  }

  addTask(body: addTask) {
    return this.httpClient.post(this.addTaskEndpoint, body)
  }

  editTask(body: editTask) {
    return this.httpClient.post(this.editTaskEndpoint, body)
  }

  deleteTask(body: deleteTask) {
    return this.httpClient.delete(this.deleteTaskEndpoint, {body: body})
  }

  getTasks(httpParams: HttpParams) {
    return this.httpClient.get(this.getTasksEndpoint, {params: httpParams})
  }
  
  assignBeat(body: assignBeat) {
    return this.httpClient.post(this.assignBeatEndpoint, body)
  }

  unassignBeat(body: unassignBeat) {
    return this.httpClient.post(this.unassignBeatEndpoint, body)
  }

}
