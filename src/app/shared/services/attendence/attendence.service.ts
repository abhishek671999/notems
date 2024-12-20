import { Injectable } from '@angular/core';
import { host } from '../../site-variables';
import { HttpClient, HttpParams } from '@angular/common/http';
import { recordUserLocation } from '../../custom_dtypes/attendence';

@Injectable({
  providedIn: 'root'
})
export class AttendenceService {

  private getMyLeavesEndpoint = host + 'attendance/get_my_leaves/'
  private getLeavesEndpoint = host + 'attendance/get_leaves/'
  private getLeaveTypesEndpoint = host + 'attendance/get_leave_types/'
  private getHolidayListEndpoint = host + 'attendance/get_holiday_list/'
  private getTodaysAttendenceEndpoint = host + 'attendance/get_todays_attendance/'
  private getMyAttendenceEndpoint = host + 'attendance/get_my_attendance/'
  private recordUserLocationEndpoint = host + 'attendance/record_user_location/'
  private getUserLocationEndpoint = host + 'attendance/get_user_locations/'
  private applyLeaveEndpoint = host + 'attendance/apply_leave/'
  private updateStatusOfLeaveEndpoint = host + 'attendance/update_status_of_leave/'
  private punchInEndpoint = host + 'attendance/punch_in/'
  private punchOutEndpoint = host + 'attendance/punch_out/'

  // Reimbursement
  private getReimbursementEndpoint = host + 'attendance/get_reimbursement_details/'
  private addReimbursementEndpoint = host + 'attendance/add_reimbursement/'

  private getDetailedReimbursementForUserEndpoint = host + 'attendance/get_all_reimbursements/'
  private getKMdrivenDetailsEndpoint = host + 'attendance/get_km_driven_details/'

  constructor(private httpClient: HttpClient) { }

  getUserLocation(httpParams: HttpParams){
    return this.httpClient.get(this.getUserLocationEndpoint, {params: httpParams})
  }

  recordUserLocation(body: recordUserLocation){
    return this.httpClient.post(this.recordUserLocationEndpoint, body)
  }

  getKMDrivenDetails(httpParams: HttpParams){
    return this.httpClient.get(this.getKMdrivenDetailsEndpoint, {params: httpParams})
  }

  getDetailedReimbursement(httpParams: HttpParams){
    return this.httpClient.get(this.getDetailedReimbursementForUserEndpoint, {params: httpParams})
  }

  getReimbursements(httpParams: HttpParams){
    return this.httpClient.get(this.getReimbursementEndpoint, {params: httpParams})
  }

  addReimbursement(body: any){
    return this.httpClient.post(this.addReimbursementEndpoint, body)
  }

  getMyLeaves() {
    return this.httpClient.get(this.getMyLeavesEndpoint)
  }

  getLeaves(httpParams: HttpParams) {
    return this.httpClient.get(this.getLeavesEndpoint, {params: httpParams})
  }

  getLeaveTypes(httpParams: HttpParams) {
    return this.httpClient.get(this.getLeaveTypesEndpoint, {params: httpParams})
  }

  getHolidayList(httpParams: HttpParams) {
    return this.httpClient.get(this.getHolidayListEndpoint, {params: httpParams})
  }

  getTodaysAttendence(httpParams: HttpParams) {
    return this.httpClient.get(this.getTodaysAttendenceEndpoint, {params: httpParams})
  }

  getMyAttendence(httpParams: HttpParams){
    return this.httpClient.get(this.getMyAttendenceEndpoint, {params: httpParams})
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
