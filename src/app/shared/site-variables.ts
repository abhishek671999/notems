import { HttpHeaders } from '@angular/common/http';
import { CookieService } from 'ngx-cookie-service';
import { Injectable } from '@angular/core';
import { MeService } from './services/register/me.service';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';

// export let host = 'http://65.20.75.191:8001/api/v1/' // local test
//export let host = 'https://takemotest.in/api/v1/'; // Demo test
export let host = 'http://139.84.139.204:8001/api/v1/'
// export let host = 'http://192.168.0.154:8000/api/v1/'

//export let host = 'https://takemo.in/api/v1/' //Prod

@Injectable({
  providedIn: 'root',
})
export class Utility {
  constructor(public cookieService: CookieService, public router: Router) {}

  getToken() {
    var token = this.cookieService.get('token');
    if (token) {
      this.setToken(token);
      return token;
    } else {
      return '';
    }
  }

  getHeaders() {
    const headers = new HttpHeaders({
      Authorization: 'Token ' + this.getToken(),
    });
    return headers;
  }

  setToken(key: string) {
    let totalExpiryDate = 60; // days
    let newDate = new Date(
      new Date().getTime() + totalExpiryDate * 24 * 60 * 60 * 1000
    );
    this.cookieService.set('token', key, newDate, '/');
  }
}

@Injectable({
  providedIn: 'root',
})
export class meAPIUtility {
  constructor(
    public cookieService: CookieService,
    private _meService: MeService,
  ) {}

  setMeData(meData: any) {
    let meDataExpiryDuration = 30; // min
    this.cookieService.set(
      'me',
      JSON.stringify(meData),
      new Date(new Date().getTime() + meDataExpiryDuration * 60 * 1000),
      '/'
    );
  }

  getMeData() {
    let meDataObservable = new Observable((observer) => {
      let meData: any = this.cookieService.get('me');
      if (meData) {
        observer.next(JSON.parse(meData));
      } else {
        this._meService.getMyInfo().subscribe((data: any) => {
          this.setMeData(data);
          observer.next(data);
        });
      }
    });
    return meDataObservable;
  }

  removeMeData() {
    this.cookieService.deleteAll('/');
    this.cookieService.delete('token');
    this.cookieService.delete('me');
    if (this.cookieService.getAll()) {
      this.cookieService.delete('token');
      this.cookieService.deleteAll('/');
    }
  }

  
}


@Injectable({
  providedIn: 'root',
})
export class sessionWrapper {

  constructor(public meAPIUtility: meAPIUtility) { }

  async setSessionVariables() {
    return new Promise((resolve, reject) => {
      this.meAPIUtility.getMeData().subscribe((data: any) => {
        sessionStorage.setItem('user_id', data['user_id'])
        if (data['organizations'].length > 0) {
          sessionStorage.setItem('organization_id', data['organizations'][0]['organization_id']) // hardcode
          sessionStorage.setItem('organization_name', data['organizations'][0]['organization_name']);
        } else if (data['teams'].length > 0) {
          sessionStorage.setItem('company_id', data['companies'][0]['company_id'])
        } 
        resolve(true)
      }),
        (error: any) => reject(false)
    })
    
  }

  getItem(key: string)  {
      let item = sessionStorage.getItem(key);
      if (item) return(item);
      else {
        this.setSessionVariables()
      return sessionStorage.getItem(key) === null ? '': sessionStorage.getItem(key)
    }
  }

  isTeamManager(){
    return this.getItem('is_team_manager') == 'true' ? true: false
  }

  isOrgManager(){
    return this.getItem('is_org_manager') == 'true' ? true: false
  }


  isCounterManagementEnabled() {
    return this.getItem('counter_management') == 'true' ? true: false
  }

  isExpenseManagementEnabled() {
    return this.getItem('expense_management') == 'true' ? true: false
  }

  isInventoryManagementEnabled() {
    return this.getItem('inventory_management') == 'true' ? true: false
  }

  isTableManagementEnabled() {
    return this.getItem('table_management') == 'true' ? true : false;
  }
  
  isMobileOrderingEnabled() {
    return this.getItem('mobile_ordering') == 'true' ? true : false;
  }
}