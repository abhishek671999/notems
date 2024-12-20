import { Component, inject, ViewChild } from '@angular/core';
import { TaskManagementService } from '../../../../shared/services/taskmanagement/task-management.service';
import { HttpParams } from '@angular/common/http';
import { getItemAnalytics } from '../../../../shared/custom_dtypes/tasks';
import { meAPIUtility } from '../../../../shared/site-variables';
import { FormControl, FormGroup } from '@angular/forms';
import { dateUtils } from '../../../../shared/utils/date_utils';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort, Sort } from '@angular/material/sort';
import { LiveAnnouncer } from '@angular/cdk/a11y';
import { item } from '../../../../shared/custom_dtypes/items';
import { organization } from '../../../../shared/custom_dtypes/me';
import { TeamManagementService } from '../../../../shared/services/team-management/team-management.service';
import { teamMember } from '../../../../shared/custom_dtypes/team';

@Component({
  selector: 'app-item-wise-analytics',
  templateUrl: './item-wise-analytics.component.html',
  styleUrl: './item-wise-analytics.component.css'
})
export class ItemWiseAnalyticsComponent {
  
    @ViewChild(MatSort)
    sort: MatSort = new MatSort;

  constructor(
    private taskService: TaskManagementService,
    private dateUtils: dateUtils,
    private meUtility: meAPIUtility,
    private teamMembersService: TeamManagementService
  ){
  }

  public teamMembers: teamMember[] = []

  ngAfterViewInit(){
    this.itemSalesDataSource.sort = this.sort
  }

  timeFrames = [
    { displayValue: 'Today', actualValue: 'today' },
    { displayValue: 'Yesterday', actualValue: 'yesterday' },
    { displayValue: 'This week', actualValue: 'this_week' },
    { displayValue: 'This month', actualValue: 'this_month' },
    { displayValue: 'Last month', actualValue: 'last_month' },
    { displayValue: 'Last 3 months', actualValue: 'last_3_months' },
    { displayValue: 'Last 6 months', actualValue: 'last_6_months' },
    { displayValue: 'This year', actualValue: 'this_year' },
    { displayValue: 'Calendar', actualValue: 'custom' },
  ];

  groupList = [
    { displayValue: 'Customer Wise', actualValue: 'customer_wise' },
    { displayValue: 'Item Wise', actualValue: 'item_wise' },
  ];

  private organizationId!: number;
  private _liveAnnouncer = inject(LiveAnnouncer);

  public selectedGroup: string = this.groupList[0].actualValue;
  public selectedTimeFrame: string = this.timeFrames[0].actualValue;
  public selectedRepresentative = ''

  range = new FormGroup({
    start: new FormControl<Date | null>(null),
    end: new FormControl<Date | null>(null),
  });


  public itemSalesDataSource = new MatTableDataSource()
  public itemSalesTableColumns: string[] =['sl_no', 'customer', 'total_amount', 'item_description']

  ngOnInit(){
    this.meUtility.getOrganization().subscribe(
      (data: any) => {
        this.organizationId = data['organization_id']
        this.fetchItemAnalytics()
        this.fetchTeamMembers()
      }
    )
  }

  fetchItemAnalytics(){
    let body: getItemAnalytics | null = {
      organization_id: this.organizationId,
      time_frame: this.selectedTimeFrame,
      customer_wise: this.selectedGroup == 'customer_wise' ? true: false,
      item_wise: this.selectedGroup == 'item_wise'? true: false
    }
    if (this.selectedRepresentative) body.representative_id = Number(this.selectedRepresentative)
    if(this.selectedTimeFrame == 'custom'){
      if (this.range.value.start && this.range.value.end) {
        body.from_date = this.dateUtils.getStandardizedDateFormate(
          this.range.value.start
        );
        body.to_date = this.dateUtils.getStandardizedDateFormate(
          this.range.value.end
        );
      } else {
        body = null;
      }
    }
    this.itemSalesTableColumns = this.selectedGroup == 'customer_wise'? ['sl_no', 'customer', 'total_amount', 'quantity', 'item_description']:['sl_no', 'item_name', 'quantity']
    if(body){
      this.taskService.getItemsAnalytics(body).subscribe(
        (data: any) => {
          let response = data[this.selectedGroup]?.item_analytics_result
          if(response){
            if(this.selectedGroup == 'customer_wise'){
              response.forEach((element: any) => {
                element['item_description'] = this.formatItems(element['items'])
                element['quantity'] = this.formatQuantity(element['items'])
              })
            }
            console.log(response)
            this.itemSalesDataSource.data = response
          }
        },
        (error: any) => {
          console.log(error)
        }
      )
    }
  }

  formatItems(items: item[]){
    let itemsString = ''
    items.forEach((item: item) => {
      itemsString += `${item.item_name} - ${item.quantity}<br>`
    })
    return itemsString
  }

  formatQuantity(items: item[]){
    let itemQuantity = 0
    items.forEach((item: item) => {
      itemQuantity += item.quantity || 0
    })
    return itemQuantity
  }

  fetchTeamMembers(){
    let httpParams = new HttpParams()
    httpParams = httpParams.append('team_type_id', 2) // hardcode
    this.teamMembersService.getUsers(httpParams).subscribe(
      (data: any) => {
        this.teamMembers = data['users']
      },
      (error: any) => {
        alert('Failed to fetch team members')
      }
    )
  }

  announceSortChange(sortState: Sort) {
    if (sortState.direction) {
      this._liveAnnouncer.announce(`Sorted ${sortState.direction}ending`);
    } else {
      this._liveAnnouncer.announce('Sorting cleared');
    }
  }

  clearFilters(){
    this.selectedTimeFrame = this.timeFrames[0].actualValue
    this.selectedRepresentative = ''
    this.selectedGroup = this.groupList[0].actualValue;
    this.fetchItemAnalytics()
  }

}
