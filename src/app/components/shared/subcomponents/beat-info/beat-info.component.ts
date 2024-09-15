import { HttpParams } from '@angular/common/http';
import { Component, Input } from '@angular/core';
import { TaskManagementService } from '../../../../shared/services/taskmanagement/task-management.service';
import { beat } from '../../../../shared/custom_dtypes/beats';

@Component({
  selector: 'app-beat-info',
  templateUrl: './beat-info.component.html',
  styleUrl: './beat-info.component.css'
})
export class BeatInfoComponent {

  constructor(private taskService: TaskManagementService){}

  @Input() beatId!: number;

  public beatInfo: beat | undefined
  
  ngOnInit(){
    this.fetchBeatInfo()
  }

  fetchBeatInfo(){
    let httpParams = new HttpParams()
    httpParams = httpParams.append('beat_id', this.beatId)
    this.taskService.getDailyBeats(httpParams).subscribe(
      (data: any) => {
        this.beatInfo = data['beats'].length > 0? data['beats'][0] : []
      },
      (error: any) => {
        alert('Failed to fetch beat info')
      }
    )
  }
}
