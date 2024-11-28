import { Component } from '@angular/core';
import { LocalityService } from '../../../shared/services/locality/locality.service';
import { meAPIUtility } from '../../../shared/site-variables';
import { MatDialog } from '@angular/material/dialog';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { HttpParams } from '@angular/common/http';
import { deleteLocality, editLocality, locality } from '../../../shared/custom_dtypes/locality';
import { ConfirmationBoxComponent } from '../dialog-box/confirmation-box/confirmation-box.component';
import { SuccessMsgComponent } from '../dialog-box/success-msg/success-msg.component';
import { ErrorMsgComponent } from '../dialog-box/error-msg/error-msg.component';
import { AddLocalityComponent } from '../bottom-sheet/add-locality/add-locality.component';

@Component({
  selector: 'app-locality',
  templateUrl: './locality.component.html',
  styleUrl: './locality.component.css'
})
export class LocalityComponent {
  constructor(
    private localityService: LocalityService,
    private meUtility: meAPIUtility,
    private matdialog: MatDialog,
    private matbottomSheet: MatBottomSheet
  ) { }

  public localityDataSource: locality[] = []
  public localityDataTableColumns = ['sl_no', 'locality_name', 'edit']
  public organizationId!: number

  ngOnInit() {
    this.meUtility.getCommonData().subscribe(
      (data: any) => {
        this.organizationId = data['organization_id']
        let role = data['role'].toLowerCase()
        if(role == 'manager' && !this.localityDataTableColumns.includes('delete')) this.localityDataTableColumns.push('delete');
        this.fetchLocalities()
      }
    )
  }

  fetchLocalities(){
    let httpParams = new HttpParams()
    httpParams = httpParams.append('organization_id', Number(this.organizationId))
    this.localityService.getLocalities(httpParams).subscribe(
      (data: any) => {
        data['localities'].forEach((locality: locality)=> {
          locality.is_edit = false
        });
        this.localityDataSource = data['localities']
      }
    )
  }

  editElement(locality: locality){
    locality.is_edit = !locality.is_edit
  }

  editSubmit(locality: locality){
    let body: editLocality = {
      locality_id: locality.locality_id,
      locality_name: locality.locality_name
    }
    this.localityService.editLocality(body).subscribe(
      (data: any) => {
        locality.is_edit = false
      },
      (error: any) => {
        alert('Failed to edit category')
      }
    )
  }

  deleteLocality(locality: locality){
    let dialogRef = this.matdialog.open(ConfirmationBoxComponent, {data: {msg: 'Are you sure want to delete this locality??'}})
    dialogRef.afterClosed().subscribe(
      (data: any) => {
        if(data?.result){
          let body: deleteLocality = {
            locality_id: locality.locality_id
          }
          this.localityService.deleteLocality(body).subscribe(
            (data: any) => {
              this.matdialog.open(SuccessMsgComponent, {data: {msg: 'Successfully deleted locality'}})
              this.ngOnInit()
            },
            (error: any) => {
              this.matdialog.open(ErrorMsgComponent, {data: {msg: 'Failed to delete locality'}})
            }
          )
        }
      }
    )
  }

  addLocality(){
    let bottomSheetRef = this.matbottomSheet.open(AddLocalityComponent)
    bottomSheetRef.afterDismissed().subscribe(
      (data: any) => {
        this.ngOnInit()
      }
    )
  }
}
