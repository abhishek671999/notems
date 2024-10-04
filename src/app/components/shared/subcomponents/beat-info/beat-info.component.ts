import { HttpParams } from '@angular/common/http';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { TaskManagementService } from '../../../../shared/services/taskmanagement/task-management.service';
import { beat } from '../../../../shared/custom_dtypes/beats';
import { customer } from '../../../../shared/custom_dtypes/customers';

@Component({
  selector: 'app-beat-info',
  templateUrl: './beat-info.component.html',
  styleUrl: './beat-info.component.css'
})
export class BeatInfoComponent {

  constructor(private taskService: TaskManagementService){}

  @Input() beatId!: number;
  @Output() newBeatCustomerEvent = new EventEmitter<customer[]>();

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
        if(this.beatInfo?.customers) this.addBeatCustomerItem(this.beatInfo?.customers)
      },
      (error: any) => {
        alert('Failed to fetch beat info')
      }
    )
  }


  addBeatCustomerItem(beatCustomers: customer[]) {
    this.newBeatCustomerEvent.emit(beatCustomers);
  }
}
