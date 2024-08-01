import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { host } from '../../site-variables';
import { addCustomer, deleteCustomer, editCustomer } from '../../custom_dtypes/customers';

@Injectable({
  providedIn: 'root'
})
export class CustomersService {

  private addCustomerEndpoint = host + 'customers/add_customer/'
  private getCustomerEndpoint = host + 'customers/get_customers/'
  private editCustomerEndpoint = host + 'customers/edit_customer/'
  private deleteCustomerEndpoint = host + 'customers/delete_customer/'

  constructor(private httpClient: HttpClient) { }

  addCustomer(body: addCustomer) {
    return this.httpClient.post(this.addCustomerEndpoint, body)
  }
  
  getCustomer(httpParams: HttpParams) {
    return this.httpClient.get(this.getCustomerEndpoint, {params: httpParams})
  }

  editCustomer(body: editCustomer) {
    return this.httpClient.post(this.editCustomerEndpoint, body)
  }

  deleteCustomer(body: deleteCustomer) {
    return this.httpClient.delete(this.deleteCustomerEndpoint, {body: body})
  }
}
