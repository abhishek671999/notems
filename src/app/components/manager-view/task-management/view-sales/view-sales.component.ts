import { Component } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { TaskManagementService } from '../../../../shared/services/taskmanagement/task-management.service';
import { HttpParams } from '@angular/common/http';
import { customer } from '../../../../shared/custom_dtypes/customers';
import { CustomersService } from '../../../../shared/services/customer/customers.service';
import { sessionWrapper } from '../../../../shared/site-variables';

@Component({
  selector: 'app-view-sales',
  templateUrl: './view-sales.component.html',
  styleUrl: './view-sales.component.css'
})
export class ViewSalesComponent {

  constructor(
    private route: ActivatedRoute,
    private taskService: TaskManagementService,
    private customerService: CustomersService,
    private sessionWrapper: sessionWrapper
  ) { }

  private beatId: number = 0
  public salesSource = []
  public customerList: customer[] = []
  public selectedCustomer: string = ''
  public selectedDate: string = ''
  public salesSourceColumns = ['customer', 'received_amount', 'discount', 'recorded_by', 'date', 'note']

  ngOnInit() {
    {
      let httpParams = new HttpParams()
      httpParams = httpParams.append('organization_id', Number(this.sessionWrapper.getItem('organization_id')))
      // httpParams = httpParams.append('type', 2) //hardcode
      this.customerService.getCustomer(httpParams).subscribe(
        (data: any) => {
          this.customerList = data['customers']
        },
        (error: any) => console.log(error)
      )
    }
    this.route.params.subscribe((params: Params) => {
      this.beatId = params['beat_id']
      let httpParams = new HttpParams()
    })
  }

  fetchSales() {
    let body: any = {
      customer_id: this.selectedCustomer,
      beat_id: this.beatId,
      time_frame: 'today',
    }
    this.taskService.getSales(body).subscribe(
      (data: any) => {
        this.salesSource = data['sale_invoices']
      },
      (error: any) => console.log(error)
    )
  }

}
