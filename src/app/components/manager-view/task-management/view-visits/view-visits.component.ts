import { Component } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { TaskManagementService } from '../../../../shared/services/taskmanagement/task-management.service';
import { HttpParams } from '@angular/common/http';
import { getTasks } from '../../../../shared/custom_dtypes/tasks';
import { beat } from '../../../../shared/custom_dtypes/beats';

@Component({
  selector: 'app-view-visits',
  templateUrl: './view-visits.component.html',
  styleUrl: './view-visits.component.css'
})
export class ViewVisitsComponent {

  constructor(
    private route: ActivatedRoute,
    private taskService: TaskManagementService
  ) { }

  private beatId: number = 0

  public beatInfo: beat | undefined
  public visitsSource = []
  public visitsSourceColumns = ['task_id', 'title', 'customer', 'status', 'description', 'note', 'added_by', 'created_at']

  ngOnInit() {
    this.route.params.subscribe((params: Params) => {
      this.beatId = params['beat_id']
      this.fetchTasks()
      this.fetchBeatDetails()
    })
  }

  fetchTasks(){
    let body: getTasks = {
      beat_id: this.beatId
    }
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
}
