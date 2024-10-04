import { Component, Inject, ViewChild } from '@angular/core';
import { TaskManagementService } from '../../../../shared/services/taskmanagement/task-management.service';
import { TeamManagementService } from '../../../../shared/services/team-management/team-management.service';
import { CustomersService } from '../../../../shared/services/customer/customers.service';
import { sessionWrapper } from '../../../../shared/site-variables';
import { dateUtils } from '../../../../shared/utils/date_utils';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { team } from '../../../../shared/custom_dtypes/team';
import { customer } from '../../../../shared/custom_dtypes/customers';
import { HttpParams } from '@angular/common/http';
import { editBeat } from '../../../../shared/custom_dtypes/tasks';
import { SuccessMsgComponent } from '../../../shared/dialog-box/success-msg/success-msg.component';
import { ErrorMsgComponent } from '../../../shared/dialog-box/error-msg/error-msg.component';
import { MatSelect } from '@angular/material/select';
import { locality } from '../../../../shared/custom_dtypes/locality';
import { LocalityService } from '../../../../shared/services/locality/locality.service';

@Component({
  selector: 'app-edit-beat',
  templateUrl: './edit-beat.component.html',
  styleUrl: './edit-beat.component.css'
})
export class EditBeatComponent {
  constructor(
    private tasksService: TaskManagementService,
    private teamService: TeamManagementService,
    private customerService: CustomersService,
    private localityService: LocalityService,
    private sessionWrapper: sessionWrapper,
    private dateUtils: dateUtils,
    private formBuilder: FormBuilder,
    private matDialog: MatDialog,
    private matdialogRef: MatDialogRef<EditBeatComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { 
    console.log(data)
    this.customerList = data.customerList
    this.customerList = data.customerList.sort(this.sortCustomerList(data.beat.customer_list))
    this.visibleCustomerList = this.customerList
    this.editBeatForm = this.formBuilder.group({
      "team_id": [data.beat.team_id, [Validators.required]],
      "locality_id": [data.beat.locality_id, [Validators.required]],
      "title": [data.beat.title, [Validators.required]],
      "note": [data.beat.note, Validators.required],
      "description": [data.beat.description, [Validators.required]]
    })

  }
  @ViewChild(MatSelect) matSelect: MatSelect | undefined;
  public editBeatForm: FormGroup;
  public teams: team[] = [];
  public customerList: customer[] = []
  public localityList: locality[] = []
  public visibleCustomerList: customer[]

  ngOnInit() {
    let httpParams = new HttpParams()
    this.teamService.getMyTeams(httpParams).subscribe(
      (data: any) => {
       this.teams = data['teams']
      }
      ,
      (error: any) => console.log(error)
    )
    this.fetchLocalities()
  }

  fetchLocalities(){
    let httpParams = new HttpParams()
    httpParams = httpParams.append('organization_id', Number(this.sessionWrapper.getItem('organization_id')))
    this.localityService.getLocalities(httpParams).subscribe(
      (data: any) => {
        this.localityList = data['localities']
      },
      (error: any) => {
        alert('Failed to fetch localities')
      }
    )
  }

  editBeatCall() {
    let body: editBeat = {
      team_id: this.editBeatForm.value.team_id,
      locality_id: this.editBeatForm.value.locality_id,
      title: this.editBeatForm.value.title,
      note: this.editBeatForm.value.note,
      description: this.editBeatForm.value.description,
      beat_id: this.data.beat.beat_id,
      assignee_id: 0,
      date: ''
    }
    this.tasksService.editBeat(body).subscribe(
      (data: any) => {
        this.matDialog.open(SuccessMsgComponent, { data: { msg: 'Beat edited successfully' } })
        this.matdialogRef.close({result: true})
      },
      (error: any) => {
        this.matDialog.open(ErrorMsgComponent, { data: { msg: 'Failed to add beat'}})
      }
    )
  }

  sortCustomerList(customerList: number[]){
    return function (customer1: customer, customer2: customer) {
      if((customerList.includes(customer1.customer_id)) && (customerList.includes(customer2.customer_id)) ) return 0
      else if(customerList.includes(customer2.customer_id)) return 1
      else return -1
    }
  }

  onKey(event: Event) { 
    let searchText: string = (event.target as HTMLInputElement).value
    this.visibleCustomerList = this.search(searchText);
  }


  search(value: any) { 
    let filter = value.toLowerCase();
    return this.customerList.filter((customer: customer) => customer.customer_name?.toLowerCase().startsWith(filter));
  }

  onOpenedChange(opened: boolean) {
    // Keep the dropdown open when the search input is focused or changed
    if (opened && this.matSelect?.panelOpen) {
      setTimeout(() => this.matSelect?.open(), 0);
    }
  }
}
