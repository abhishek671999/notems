import { Component } from '@angular/core';
import { AttendenceService } from '../../../../shared/services/attendence/attendence.service';
import { meAPIUtility } from '../../../../shared/site-variables';
import { MatDialog } from '@angular/material/dialog';
import { dateUtils } from '../../../../shared/utils/date_utils';
import { h } from '@fullcalendar/core/preact.js';
import { HttpParams } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { MatTableDataSource } from '@angular/material/table';
import { MapViewComponent } from '../../../shared/dialog-box/map-view/map-view.component';

@Component({
  selector: 'app-live-location-tracker',
  templateUrl: './live-location-tracker.component.html',
  styleUrl: './live-location-tracker.component.css'
})
export class LiveLocationTrackerComponent {
    constructor(
      private attendenceService: AttendenceService,
      private meUtility: meAPIUtility,
      private matDialog: MatDialog,
      private dateUtils: dateUtils,
      private route: ActivatedRoute
    ) {}

    public liveLocationDataSource = new MatTableDataSource([]);
    public liveLocationColumns: string[] = ['sl_no', 'recorded_at', 'location']
    public userName?: string;

    ngOnInit() {
      this.route.queryParams.subscribe((params) => {
        let httpParams = new HttpParams()
        httpParams = httpParams.append('user_id', params['user_id'])
        httpParams = httpParams.append('date', params['date'])
        this.attendenceService.getUserLocation(httpParams).subscribe(
          (data: any) => {
            console.log(data)
          this.liveLocationDataSource.data = data['locations']
          this.userName = data['user']
        })
      })
    }

      openLocationScreen(attendence: any) {
        let location = attendence.split(',');
        this.matDialog.open(MapViewComponent, {
          data: { longitude: location[1], latitude: location[0] },
        });
      }
}
