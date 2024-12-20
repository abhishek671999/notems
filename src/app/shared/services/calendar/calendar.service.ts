import { Injectable } from '@angular/core';
import { host } from '../../site-variables';
import { HttpClient, HttpParams } from '@angular/common/http';
import { addHoliday, deleteHoliday, editHoliday } from '../../custom_dtypes/calendar';

@Injectable({
  providedIn: 'root'
})
export class CalendarService {

  private getHolidayListEndpoint = host + 'attendance/get_holiday_list/'
  private addHolidayEndpoint = host + 'attendance/add_holiday_list/'
  private editHolidayEndpoint = host + 'attendance/edit_holiday_list/'
  private deleteHolidayEndpoint = host + 'attendance/delete_holiday_list/'

  constructor(private httpClient: HttpClient) { }

  getHolidayList(httpParams: HttpParams) {
    return this.httpClient.get(this.getHolidayListEndpoint, {params: httpParams})
  }

  addHoliday(body: addHoliday) {
    return this.httpClient.post(this.addHolidayEndpoint, body)
  }

  editHoliday(body: editHoliday) {
    return this.httpClient.post(this.editHolidayEndpoint, body)
  }

  deleteHoliday(body: deleteHoliday) {
    return this.httpClient.delete(this.deleteHolidayEndpoint, {body: body})
  }
}
