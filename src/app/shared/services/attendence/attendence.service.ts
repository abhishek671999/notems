import { Injectable } from '@angular/core';
import { host } from '../../site-variables';
import { HttpClient, HttpParams } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AttendenceService {

  private getMyLeavesEndpoint = host + 'attendance/get_my_leaves/'
  private getLeavesEndpoint = host + 'attendance/get_leaves/'
  private getLeaveTypesEndpoint = host + 'attendance/get_leave_types/'
  private getHolidayListEndpoint = host + 'attendance/get_holiday_list/'
  private getAttendenceEndpoint = host + 'attendance/get_todays_attendance/'
  private applyLeaveEndpoint = host + 'attendance/apply_leave/'
  private updateStatusOfLeaveEndpoint = host + 'attendance/update_status_of_leave/'
  private punchInEndpoint = host + 'attendance/punch_in/'
  private punchOutEndpoint = host + 'attendance/punch_out/'

  constructor(private httpClient: HttpClient) { }


  getMyLeaves() {
    return this.httpClient.get(this.getMyLeavesEndpoint)
  }

  getLeaves() {
    return this.httpClient.get(this.getLeavesEndpoint)
  }

  getLeaveTypes(httpParams: HttpParams) {
    return this.httpClient.get(this.getLeaveTypesEndpoint, {params: httpParams})
  }

  getHolidayList(httpParams: HttpParams) {
    return this.httpClient.get(this.getHolidayListEndpoint, {params: httpParams})
  }

  getTodaysAttendence(httpParams: HttpParams) {
    return this.httpClient.get(this.getAttendenceEndpoint, {params: httpParams})
  }

  applyLeave(body: any) {
    return this.httpClient.post(this.applyLeaveEndpoint, body)
  }

  updateLeaveStatus(body: any) {
    return this.httpClient.post(this.updateStatusOfLeaveEndpoint, body)
  }

  punchIn(body: any) {
    return this.httpClient.post(this.punchInEndpoint, body)
  }

  punchOut(body: any) {
    return this.httpClient.post(this.punchOutEndpoint, body)
  }

}
