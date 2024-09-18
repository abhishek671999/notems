import { Component } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { TaskManagementService } from '../../../../shared/services/taskmanagement/task-management.service';
import { HttpParams } from '@angular/common/http';
import { getTasks } from '../../../../shared/custom_dtypes/tasks';
import { beat } from '../../../../shared/custom_dtypes/beats';
import { MatDialog } from '@angular/material/dialog';
import { MapViewComponent } from '../../../shared/dialog-box/map-view/map-view.component';
import { PageEvent } from '@angular/material/paginator';
import { dateUtils } from '../../../../shared/utils/date_utils';

@Component({
  selector: 'app-view-visits',
  templateUrl: './view-visits.component.html',
  styleUrl: './view-visits.component.css'
})
export class ViewVisitsComponent {

  constructor(
    private route: ActivatedRoute,
    private taskService: TaskManagementService,
    private matDialog: MatDialog,
    private dateUtils: dateUtils
  ) { }

  public beatId: number = 0

  length = 50;
  pageSize = 30;
  pageIndex = 0;
  pageSizeOptions = [50, 100, 150];
  hidePageSize = false;
  showPageSizeOptions = true;
  showFirstLastButtons = true;

  public beatInfo: beat | undefined
  public visitsSource = []
  public visitsSourceColumns = ['task_id', 'customer', 'status', 'description', 'note', 'added_by', 'created_at', 'location']

  public selectedDate = new Date()

  ngOnInit() {
    this.route.params.subscribe((params: Params) => {
      this.beatId = params['beat_id']
      this.fetchTasks()
      this.fetchBeatDetails()
    })
  }

  fetchTasks(){
    let body: getTasks = {
      beat_id: this.beatId,
      offset: this.pageIndex * this.pageSize,
      count: this.pageIndex * this.pageSize + this.pageSize
    }
    if(this.selectedDate) body['date'] = this.dateUtils.getStandardizedDateFormate(new Date(this.selectedDate))
    this.taskService.getTasks(body).subscribe(
      (data: any) => {
        console.log('data', data)
        this.visitsSource = data['tasks']
      },
      (error: any) => console.log(error)
    )
  }
  fetchBeatDetails(){
    let httpParams = new HttpParams()
    httpParams = httpParams.append('beat_id', this.beatId)
    this.taskService.getDailyBeats(httpParams).subscribe(
      (data: any) => {
        this.beatInfo = data['beats'][0]
      },
      (error: any) => {
        alert('Failed to fetch beat info')
      }
    )
  }

  openLocationScreen(attendence: any) {
    let location = attendence.split(',');
    this.matDialog.open(MapViewComponent, {
      data: { longitude: location[1], latitude: location[0] },
    });
  }

  handlePageEvent(e: PageEvent) {
    this.length = e.length;
    this.pageSize = e.pageSize;
    this.pageIndex = e.pageIndex;
    this.fetchTasks();
  } 
}
