import { HttpParams } from '@angular/common/http';
import { Component } from '@angular/core';
import { CustomersService } from '../../../shared/services/customer/customers.service';
import { ActivatedRoute, Params } from '@angular/router';
import { TaskManagementService } from '../../../shared/services/taskmanagement/task-management.service';
import { sessionWrapper } from '../../../shared/site-variables';

@Component({
  selector: 'app-add-sale',
  templateUrl: './add-sale.component.html',
  styleUrl: './add-sale.component.css'
})
export class AddSaleComponent {

  constructor(
    private customerService: CustomersService,
    private taskService: TaskManagementService,
    private route: ActivatedRoute,
    private sessionWrapper: sessionWrapper,
  ) { };
  public customerList: [] = []
  public beatId: number = 0

  ngOnInit() {
    let httpParams = new HttpParams()
    httpParams = httpParams.append('organization_id', Number(this.sessionWrapper.getItem('organization_id')))
    // httpParams = httpParams.append('type', 2) //hardcode
    this.customerService.getCustomer(httpParams).subscribe(
      (data: any) => {
        this.customerList = data['customers']
      },
      (error: any) => console.log(error)
    )

    this.route.params.subscribe((params: Params) => {
      this.beatId = params['beat_id']
      let httpParams = new HttpParams()
      httpParams = httpParams.append('beat_id', this.beatId)
      this.taskService.getTasks(httpParams).subscribe(
        (data: any) => {
          console.log('data', data)
        },
        (error: any) => {
          console.log(error)
          alert('Error while fetching tasks')
        }
      )
    })
  }
}
