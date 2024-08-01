import { Component, Inject } from '@angular/core';
import { TaskManagementService } from '../../../../shared/services/taskmanagement/task-management.service';
import { HttpParams } from '@angular/common/http';
import { MAT_DIALOG_DATA, MatDialog, MatDialogModule } from '@angular/material/dialog';
import { dateUtils } from '../../../../shared/utils/date_utils';
import { MatTableModule } from '@angular/material/table';

@Component({
  selector: 'app-assigned-beats-view',
  standalone: true,
  imports: [MatDialogModule, MatTableModule],
  templateUrl: './assigned-beats-view.component.html',
  styleUrl: './assigned-beats-view.component.css'
})
export class AssignedBeatsViewComponent {

  constructor(
    private taskManagementService: TaskManagementService,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dateUtils: dateUtils
  ) {
    
  }

  public tasksDataSource: any = []
  public tasksDataSourceColumns = []

  ngOnInit() {
    let httpParams = new HttpParams()
    httpParams = httpParams.append('assignee_id', this.data.user_id)
    httpParams = httpParams.append('date', String(this.dateUtils.getStandardizedDateFormate(new Date())))
    this.taskManagementService.getBeats(httpParams).subscribe(
      (data: any) => {
        data['beats'].forEach((beat: any) => {
          let httpParams = new HttpParams()
          httpParams = httpParams.append('beat_id', beat.beat_id)
          this.taskManagementService.getTasks(httpParams).subscribe(
            (data: any) => this.tasksDataSource = [...this.tasksDataSource, ...data['tasks']]
          )
        });
      }
    )
  }

}
