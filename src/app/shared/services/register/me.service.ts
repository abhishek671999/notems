import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { host, Utility } from '../../site-variables';

@Injectable({
  providedIn: 'root'
})
export class MeService {


  meEndpoint = 'users/me/'
  updateUserDetailsEndpoint = 'users/update_user_profile/'
  rolesEndpoint = 'role/get_roles/'
  __getRestaurantAdminEmailEndpoint = 'users/get_restaurant_admin_email/'

  constructor(private __httpClient: HttpClient, public utility: Utility) { }

  getMyInfo(){
    return this.__httpClient.get(host+this.meEndpoint, {headers: this.utility.getHeaders()})
  }

  getRoles(){
    return this.__httpClient.get(host+this.rolesEndpoint, {headers: this.utility.getHeaders()})
  }
  
  updateUserDetails(body: any) {
    return this.__httpClient.post(host+this.updateUserDetailsEndpoint, body)
  }

  getRestaurantAdminEmail(httpParams: HttpParams) {
    return this .__httpClient.get(host + this.__getRestaurantAdminEmailEndpoint, {params: httpParams})
  }
}

