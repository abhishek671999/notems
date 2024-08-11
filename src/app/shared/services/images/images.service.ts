import { Injectable } from '@angular/core';
import { host } from '../../site-variables';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ImagesService {

  private addImageEndpoint = host + 'sales/add_image/'
  private deleteImageEndpoit = host + 'sales/delete_image/'

  constructor(private httpClient: HttpClient) { }

  uploadImage(formData: FormData) {
    return this.httpClient.post(this.addImageEndpoint, formData)
  }
}
