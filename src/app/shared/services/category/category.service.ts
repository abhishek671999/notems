import { Injectable } from '@angular/core';
import { host } from '../../site-variables';
import { HttpClient, HttpParams } from '@angular/common/http';
import { addCategory, deleteCategory, editCategory } from '../../custom_dtypes/category';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {

  private addCategoryEndpoint = host + 'sales/add_category/'
  private deleteCategoryEndpoint = host + 'sales/delete_category/'
  private getCategoriesEndpoint = host + 'sales/get_categories/'
  private editCategoriesEndpoint = host + 'sales/edit_category/'

  constructor(private httpClient: HttpClient) { }

  addCategory(body: addCategory) {
    return this.httpClient.post(this.addCategoryEndpoint, body)
  }

  deleteCategory(body: deleteCategory) {
    return this.httpClient.delete(this.deleteCategoryEndpoint, {body: body})
  }

  getCategories(httpParams: HttpParams) {
    return this.httpClient.get(this.getCategoriesEndpoint, {params: httpParams})
  }

  editCategories(body: editCategory) {
    return this.httpClient.post(this.editCategoriesEndpoint, body)
  }

}
