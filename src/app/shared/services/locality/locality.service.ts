import { Injectable } from '@angular/core';
import { host } from '../../site-variables';
import { HttpClient, HttpParams } from '@angular/common/http';
import { addLocality, deleteLocality, editLocality } from '../../custom_dtypes/locality';

@Injectable({
  providedIn: 'root'
})
export class LocalityService {

  private getLocalityEndpoint = host + 'customers/get_locality/'
  private addLocalityEndpoint = host + 'customers/add_locality/'
  private editLocalityEndpoiont = host + 'customers/edit_locality/'
  private deleteLocalityEndpoint = host + 'customers/delete_locality/'

  constructor(
    private httpClient: HttpClient
  ) { }

  getLocalities(httparams: HttpParams){
    return this.httpClient.get(this.getLocalityEndpoint, {params: httparams})
  }

  addLocality(body: addLocality){
    return this.httpClient.post(this.addLocalityEndpoint, body)
  }

  editLocality(body: editLocality){
    return this.httpClient.post(this.editLocalityEndpoiont, body)
  }

  deleteLocality(body: deleteLocality){
    return this.httpClient.delete(this.deleteLocalityEndpoint, {body: body})
  }
}
