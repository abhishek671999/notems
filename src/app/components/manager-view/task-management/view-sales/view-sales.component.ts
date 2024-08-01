import { Component } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { TaskManagementService } from '../../../../shared/services/taskmanagement/task-management.service';
import { HttpParams } from '@angular/common/http';

@Component({
  selector: 'app-view-sales',
  templateUrl: './view-sales.component.html',
  styleUrl: './view-sales.component.css'
})
export class ViewSalesComponent {

  constructor(
    private route: ActivatedRoute,
    private taskService: TaskManagementService
  ) { }

  private beatId: number = 0
  public salesSource = []
  public salesSourceColumns = ['task_id', 'title', 'customer', 'status', 'description', 'note', 'added_by', 'created_at']

  ngOnInit() {
    this.route.params.subscribe((params: Params) => {
      this.beatId = params['beat_id']
      let httpParams = new HttpParams()
      httpParams = httpParams.append('beat_id', this.beatId)
      this.taskService.getTasks(httpParams).subscribe(
        (data: any) => {
          console.log('data', data)
          this.salesSource = data['tasks']
        },
        (error: any) => console.log(error)
      )
    })
  }


}
