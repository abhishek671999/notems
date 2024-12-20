import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  public myLeaveSubject = new Subject<any>();
  public myLeaveSubjectObservable = this.myLeaveSubject.asObservable();

  constructor() { }

  setMyLeaveData(data: any) {
    this.myLeaveSubject.next(data);
  }
  
}
