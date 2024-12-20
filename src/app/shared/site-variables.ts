import { HttpHeaders } from '@angular/common/http';
import { CookieService } from 'ngx-cookie-service';
import { Injectable } from '@angular/core';
import { MeService } from './services/register/me.service';
import { Router } from '@angular/router';
import { Observable, Subject } from 'rxjs';
import { organization, team } from './custom_dtypes/me';
import { environment } from '../../environments/environment';

export let host = environment.host

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
  public locationSubject = new Subject<any>();
  public locationSubjectObservable = this.locationSubject.asObservable();

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

  setOrganization(organization: organization, duration=6000){
    this.cookieService.delete('team', '/')
    let expiryDuration = duration; // min
    this.cookieService.set(
      'organization',
      JSON.stringify(organization),
      new Date(new Date().getTime() + expiryDuration * 60 * 1000),
      '/'
    );
  }

  setTeam(team: team, duration=6000){
    this.cookieService.delete('organization', '/')
    let expiryDuration = duration; // min
    this.cookieService.set(
      'team',
      JSON.stringify(team),
      new Date(new Date().getTime() + expiryDuration * 60 * 1000),
      '/'
    );
  }

  getOrganization(){
    let organizationObservable = new Observable((observer) => {
      let organizationData = this.cookieService.get('organization')
      if(!(typeof(organizationData) == "undefined" || organizationData === "" || organizationData == "undefined")){
        let data = JSON.parse(organizationData)
        observer.next(data)
      } else {
        this.getMeData().subscribe((data: any) => {
          if(data['organizations'].length > 0){
            let firstOrganizationtInList = data['organizations'][0]
            this.setOrganization(firstOrganizationtInList)
            observer.next(firstOrganizationtInList)
          }
        })
      }
    })
    return organizationObservable
  }

  getCommonData(){
    let organizationObservable = new Observable((observer) => {
      let organizationData = this.cookieService.get('organization')
      let TeamData = this.cookieService.get('team')
      if(!(typeof(organizationData) == "undefined" || organizationData === "" || organizationData == "undefined")){
        let data = JSON.parse(organizationData)
        observer.next(data)
      }
      else if(!(typeof(TeamData) == "undefined" || TeamData === "" || TeamData == "undefined")){
        let data = JSON.parse(TeamData)
        observer.next(data)
      } else {
        this.getMeData().subscribe((data: any) => {
          if(data['organizations'].length > 0){
            let firstOrganizationtInList = data['organizations'][0]
            this.setOrganization(firstOrganizationtInList)
            observer.next(firstOrganizationtInList)
          } else if(data['teams'].length > 0){
            let firstTeamInList = data['teams'][0]
            this.setTeam(firstTeamInList)
            observer.next(firstTeamInList)
          }
        })
      }
    }
    )
    return organizationObservable
  }


  getTeam(){
    let teamObservable = new Observable((observer) => {
      let TeamData = this.cookieService.get('team')
      if(!(typeof(TeamData) == "undefined" || TeamData === "" || TeamData == "undefined")){
        let data = JSON.parse(TeamData)
        observer.next(data)
      } else {
        this.getMeData().subscribe((data: any) => {
          if(data['teams'].length > 0){
            let firstTeamInList = data['teams'][0]
            this.setTeam(firstTeamInList)
            observer.next(firstTeamInList)
          }
        })
      }
    })
    return teamObservable
  }

  removeMeData() {
    this.cookieService.deleteAll('/');
    this.cookieService.delete('token');
    this.cookieService.delete('me');
    this.cookieService.delete('teams')
    this.cookieService.delete('organization')
    if (this.cookieService.getAll()) {
      this.cookieService.delete('token');
      this.cookieService.deleteAll('/');
      this.cookieService.delete('teams')
      this.cookieService.delete('organization')
    }
  }
}
