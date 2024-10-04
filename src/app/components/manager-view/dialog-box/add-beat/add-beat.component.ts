import { Component, Inject, ViewChild } from '@angular/core';
import { addBeat } from '../../../../shared/custom_dtypes/tasks';
import { TaskManagementService } from '../../../../shared/services/taskmanagement/task-management.service';
import { sessionWrapper } from '../../../../shared/site-variables';
import { dateUtils } from '../../../../shared/utils/date_utils';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { SuccessMsgComponent } from '../../../shared/dialog-box/success-msg/success-msg.component';
import { ErrorMsgComponent } from '../../../shared/dialog-box/error-msg/error-msg.component';
import { HttpParams } from '@angular/common/http';
import { TeamManagementService } from '../../../../shared/services/team-management/team-management.service';
import { team } from '../../../../shared/custom_dtypes/team';
import { customer } from '../../../../shared/custom_dtypes/customers';
import { CustomersService } from '../../../../shared/services/customer/customers.service';
import { MatSelect } from '@angular/material/select';
import { LocalityService } from '../../../../shared/services/locality/locality.service';
import { locality } from '../../../../shared/custom_dtypes/locality';

@Component({
  selector: 'app-add-beat',
  templateUrl: './add-beat.component.html',
  styleUrl: './add-beat.component.css'
})
export class AddBeatComponent {

  constructor(
    private tasksService: TaskManagementService,
    private teamService: TeamManagementService,
    private customerService: CustomersService,
    private localityService: LocalityService,
    private sessionWrapper: sessionWrapper,
    private dateUtils: dateUtils,
    private formBuilder: FormBuilder,
    private matDialog: MatDialog,
    private matdialogRef: MatDialogRef<AddBeatComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { 
    this.newBeat = this.formBuilder.group({
      "team_id": ['', [Validators.required]],
      "customer_list": [, [Validators.required]],
      "title": ['', [Validators.required]],
      "note": ['', Validators.required],
      "description": ['', [Validators.required]],
      "locality_id": ['', [Validators.required]]
    })
  }
  
  @ViewChild(MatSelect) matSelect: MatSelect | undefined;
  public newBeat: FormGroup;
  public teams: team[] = [];
  public customerList: customer[] = []
  public localityList: locality[] = []
  public visibleCustomerList: customer[] = []

  ngOnInit() {
    let httpParams = new HttpParams()
    this.teamService.getMyTeams(httpParams).subscribe(
      (data: any) => {
       this.teams = data['teams']
      }
      ,
      (error: any) => console.log(error)
    )

    this.fetchCustomer()
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

  fetchCustomer(){
    let httpParams = new HttpParams()
    httpParams = httpParams.append('organization_id', Number(this.sessionWrapper.getItem('organization_id')))
    this.customerService.getCustomer(httpParams).subscribe(
      (data: any) => {
        this.customerList = data['customers']
        this.visibleCustomerList = this.customerList
      },
      (error: any) => alert('Failed to get customer list')
    )
  }

  onKey(event: Event) { 
    let searchText: string = (event.target as HTMLInputElement).value
    this.visibleCustomerList = this.search(searchText);
  }


  search(value: any) { 
    let filter = value.toLowerCase();
    return this.customerList.filter((customer: customer) => customer.customer_name?.toLowerCase().startsWith(filter));
  }

  addBeatCall() {
    let body: addBeat = {
      team_id: this.newBeat.value.team_id,
      locality_id: this.newBeat.value.locality_id,
      title: this.newBeat.value.title,
      note: this.newBeat.value.note,
      description: this.newBeat.value.description
    }
    this.tasksService.addBeat(body).subscribe(
      (data: any) => {
        this.matDialog.open(SuccessMsgComponent, { data: { msg: 'Beat added successfully' } })
        this.matdialogRef.close({result: true})
      },
      (error: any) => {
        this.matDialog.open(ErrorMsgComponent, { data: { msg: 'Failed to add beat'}})
      }
    )
  }

  onOpenedChange(opened: boolean) {
    // Keep the dropdown open when the search input is focused or changed
    if (opened && this.matSelect?.panelOpen) {
      setTimeout(() => this.matSelect?.open(), 0);
    }
  }

}
