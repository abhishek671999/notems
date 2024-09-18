import { Component } from '@angular/core';
import { TaskManagementService } from '../../../../shared/services/taskmanagement/task-management.service';
import { HttpParams } from '@angular/common/http';
import { sessionWrapper } from '../../../../shared/site-variables';
import { dateUtils } from '../../../../shared/utils/date_utils';
import { addBeat, deleteBeat } from '../../../../shared/custom_dtypes/tasks';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { SuccessMsgComponent } from '../../../shared/dialog-box/success-msg/success-msg.component';
import { ErrorMsgComponent } from '../../../shared/dialog-box/error-msg/error-msg.component';
import { AddBeatComponent } from '../../dialog-box/add-beat/add-beat.component';
import { TeamManagementService } from '../../../../shared/services/team-management/team-management.service';
import { DataSource } from '@angular/cdk/collections';
import { Router } from '@angular/router';
import { beat } from '../../../../shared/custom_dtypes/beats';
import { ConfirmationBoxComponent } from '../../../shared/dialog-box/confirmation-box/confirmation-box.component';
import { EditBeatComponent } from '../../dialog-box/edit-beat/edit-beat.component';
import { CustomersService } from '../../../../shared/services/customer/customers.service';
import { customer } from '../../../../shared/custom_dtypes/customers';
import { PageEvent } from '@angular/material/paginator';

@Component({
  selector: 'app-beats',
  templateUrl: './beats.component.html',
  styleUrl: './beats.component.css'
})
export class BeatsComponent {

  constructor(
    private tasksService: TaskManagementService,
    private teamService: TeamManagementService,
    private customerService: CustomersService,
    private sessionWrapper: sessionWrapper,
    private dateUtils: dateUtils,
    private formBuilder: FormBuilder,
    private matDialog: MatDialog,
    private router: Router
  ) { 
    this.newBeat = this.formBuilder.group({
      "team_id": ['', [Validators.required]],
      "title": ['', [Validators.required]],
      "note": ['', Validators.required],
      "description": ['', [Validators.required]]
    })
  }

  length = 50;
  pageSize = 20;
  pageIndex = 0;
  pageSizeOptions = [50, 100, 150];;
  hidePageSize = false;
  showPageSizeOptions = true;
  showFirstLastButtons = true;

  public newBeat: FormGroup;
  public selectedTeam: any;
  public teams: any;
  public savedBeats: any = [];
  public customerList: customer[] = []
  public savedBeatsColumns = ['beat_id', 'title', 'reporter', 'team_name', 'team_type', 'description', 'locality_name', 'create_date', 'edit', 'delete']

  ngOnInit() {
    {
      let httpParams = new HttpParams()
      this.teamService.getMyTeams(httpParams).subscribe(
        (data: any) => {
         this.teams = data['teams']
        }
        ,
        (error: any) => console.log(error)
      )
    }
    {
      let httpParams = new HttpParams()
      httpParams = httpParams.append('organization_id', Number(this.sessionWrapper.getItem('organization_id')))
      this.customerService.getCustomer(httpParams).subscribe(
        (data: any) => this.customerList = data['customers'],
        (error: any) => alert('Failed to get customer list')
      )
    }
    this.fetchBeats()
  }

  fetchBeats(){
    let httpParams = new HttpParams()
      if(this.selectedTeam) httpParams = httpParams.append('team_id', this.selectedTeam)
      this.tasksService.getBeats(httpParams).subscribe(
        (data: any) => {
          this.savedBeats = data['beats']
        },
        (error: any) => alert(error)
      )
  }

  addBeat() {
    let dialogRef = this.matDialog.open(AddBeatComponent, { data: {team_id: this.selectedTeam} })
    dialogRef.afterClosed().subscribe(
      (data: any) => {
        this.ngOnInit()
      }
    )
  }

  deleteBeat(beat: beat, event: Event) {
    event.stopPropagation()
    let matdialogRef = this.matDialog.open(ConfirmationBoxComponent, { data: { msg: 'Are you sure want to delete this beat?' } })
    matdialogRef.afterClosed().subscribe(
      (data: any) => {
        if (data?.result) {
          let body: deleteBeat = {
            beat_id: beat.beat_id
          }
          this.tasksService.deleteBeat(body).subscribe(
            (data: any) => {
              this.matDialog.open(SuccessMsgComponent, { data: { msg: 'Beat delete successfully' } })
              this.ngOnInit()
            },
            (error: any) => {
              this.matDialog.open(ErrorMsgComponent, {data: {msg: 'Beat delete Failed'}})
            }
          )
        }
      }
    )
  }

  editBeat(beat: beat, event: Event) {
    event.stopPropagation()
    let dialogRef = this.matDialog.open(EditBeatComponent, { data: {beat: beat, customerList: this.customerList} })
    dialogRef.afterClosed().subscribe(
      (data: any) => {
        if(data?.result) this.ngOnInit()
      }
    )
  }

  getCustomerName(beat: any){
    let customerName = ''
    beat.customer_list.forEach(
      (customer_id: number, index: number) => 
        {
          let filteredCustomer = this.customerList.filter((customer: customer) => customer.customer_id == customer_id)
          customerName += (filteredCustomer.length > 0)? `${index+1}. ${filteredCustomer[0].outlet_name} <br>` : ''
        }
    )
    return customerName
  }

  getLocalityName(beat: any){
    let customerName = ''
    beat.customer_list.forEach(
      (customer_id: number, index: number) => 
        {
          let filteredCustomer = this.customerList.filter((customer: customer) => customer.customer_id == customer_id)
          customerName += (filteredCustomer.length > 0)? `${index+1}. ${filteredCustomer[0].outlet_name} <br>` : ''
        }
    )
    return customerName
  }
  

  handlePageEvent(e: PageEvent) {
    this.length = e.length;
    this.pageSize = e.pageSize;
    this.pageIndex = e.pageIndex;
    this.fetchBeats();
  } 

}
