import { Component, ViewChild, viewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatBottomSheetRef } from '@angular/material/bottom-sheet';
import { AttendenceService } from '../../../../shared/services/attendence/attendence.service';
import { dateUtils } from '../../../../shared/utils/date_utils';

@Component({
  selector: 'app-add-reimbursement',
  templateUrl: './add-reimbursement.component.html',
  styleUrl: './add-reimbursement.component.css'
})
export class AddReimbursementComponent {

  @ViewChild('submitButton') submitButton: any;
  constructor(
    private formbuilder: FormBuilder,
    private matBottomSheetRef: MatBottomSheetRef<AddReimbursementComponent>,
    private attendenceService: AttendenceService,
    private dateUtils: dateUtils
  ){
    this.reimbursementForm = this.formbuilder.group({
      "date": ['', [Validators.required]],
      "reimbursement_amount": ['', [Validators.required]],
      "reimbursement_reason": ['', [Validators.required]],
    })
  }

  public reimbursementForm: FormGroup;

  public files: File[] = []
  public file: File | null = null;
  outputBoxVisible = false;
  progress = `0%`;
  uploadResult = '';
  fileName = '';
  fileSize = '';
  uploadStatus: number | undefined;

  addReimbursement(){
    if(this.submitButton) this.submitButton._elementRef.nativeElement.disabled = true
    let formData = new FormData()
    let date = this.dateUtils.getStandardizedDateFormate( this.reimbursementForm.value.date)
    if(date) formData.append('date',  date)
    formData.append('reimbursement_amount', this.reimbursementForm.value.reimbursement_amount)
    formData.append('reimbursement_reason', this.reimbursementForm.value.reimbursement_reason)
    if(this.file) formData.append('file', this.file)
    this.attendenceService.addReimbursement(formData).subscribe(
      (data: any) => {
        this.matBottomSheetRef.dismiss({result: true})
      },
      (error: any) => {
        this.submitButton._elementRef.nativeElement.disabled = false
      }
    )

  }

  handleDragOver(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
  }

  handleDrop(event: DragEvent) {
    event.preventDefault();
    if (event.dataTransfer) {
      const file: File = event.dataTransfer.files[0];
      this.onFileSelected(event);
    }
  }

  onFileSelected(event: any) {
    this.outputBoxVisible = true;
    this.progress = `0%`;
    this.uploadResult = '';
    this.fileName = '';
    this.fileSize = '';
    this.uploadStatus = undefined;
    this.file = event.dataTransfer?.files[0] || event.target?.files[0];
    if(this.file){
      this.fileName = this.file.name;
      this.fileSize = `${(this.file.size / 1024).toFixed(2)} KB`;
    }
    
  }

}
