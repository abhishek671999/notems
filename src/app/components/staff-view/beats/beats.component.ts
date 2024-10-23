import { Component } from '@angular/core';
import { TaskManagementService } from '../../../shared/services/taskmanagement/task-management.service';
import { HttpParams } from '@angular/common/http';
import { meAPIUtility } from '../../../shared/site-variables';
import { beat } from '../../../shared/custom_dtypes/beats';
import { Router } from '@angular/router';

@Component({
  selector: 'app-beats',
  templateUrl: './beats.component.html',
  styleUrl: './beats.component.css'
})
export class BeatsComponent {

  constructor(
    private tasksService: TaskManagementService,
    private meUtility: meAPIUtility,
    private router: Router
  ) { }

  public beats: beat[]= []
  private userId!: number;
  
  ngOnInit() {
    this.meUtility.getMeData().subscribe(
      (data: any) => {
        this.userId = data['user_id']
      }
    )
  }

  fetchDailyBeats(){
    let httpParams = new HttpParams()
    httpParams = httpParams.append('assignee_id', Number(this.userId))
    this.tasksService.getDailyBeats(httpParams).subscribe(
      (data: any) => {
        this.beats = data['beats']
        console.log(this.beats)
      },
      (error: any) => {
        console.log(error)
      }
    )
  }

  openBeat(beat: beat) {
    console.log(beat)
    if (beat.team_type.toLowerCase() == 'marketing') this.router.navigate(['./staff/visit', beat.beat_id]);
    else if(beat.team_type.toLowerCase() == 'sales') this.router.navigate(['./staff/sale', beat.beat_id])
  }
}
