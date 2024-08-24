import { Component } from '@angular/core';
import { LocalityService } from '../../../../shared/services/locality/locality.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { sessionWrapper } from '../../../../shared/site-variables';
import { MatBottomSheetRef } from '@angular/material/bottom-sheet';
import { MatDialog } from '@angular/material/dialog';
import { addLocality } from '../../../../shared/custom_dtypes/locality';
import { ErrorMsgComponent } from '../../dialog-box/error-msg/error-msg.component';

@Component({
  selector: 'app-add-locality',
  templateUrl: './add-locality.component.html',
  styleUrl: './add-locality.component.css'
})
export class AddLocalityComponent {
  constructor(
    private localityService: LocalityService,
    private formbuilder: FormBuilder,
    private sessionWrapper: sessionWrapper,
    private matsheetRef: MatBottomSheetRef<AddLocalityComponent>,
    private matdialog: MatDialog
  ) { 
    this.newLocalityForm = this.formbuilder.group({
      'locality_name': ['', [Validators.required]]
    })
  }
  public newLocalityForm: FormGroup;

  addLocality() {
    let body: addLocality = {
      locality_name: this.newLocalityForm.value.locality_name,
      organization_id: Number(this.sessionWrapper.getItem('organization_id'))
    }
    this.localityService.addLocality(body).subscribe(
      (data: any) => this.matsheetRef.dismiss(true),
      (error: any) => this.matdialog.open(ErrorMsgComponent, { data: {msg: 'Failed to add locality'}})
    )
  }
}
