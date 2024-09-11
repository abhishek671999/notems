import { Component, Inject, inject } from '@angular/core';
import { AttendenceService } from '../../../../shared/services/attendence/attendence.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-capture-attendence',
  templateUrl: './capture-attendence.component.html',
  styleUrl: './capture-attendence.component.css'
})
export class CaptureAttendenceComponent {

  constructor(
    private attendenceService: AttendenceService,
    private matdialogRef: MatDialogRef<CaptureAttendenceComponent>,
    private formbuilder: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: any
  ){
    this.attendenceForm = this.formbuilder.group({
      starting_km: [''],
      ending_km: ['']
    })
  }

  public location: string = ''

  public attendenceForm: FormGroup;
  public files: File[] = []
  public file: File | null = null;
  outputBoxVisible = false;
  progress = `0%`;
  uploadResult = '';
  fileName = '';
  fileSize = '';
  uploadStatus: number | undefined; 


  
  
  clockIn(){
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        debugger
        const formData = new FormData();
        if(this.file) formData.append('file', this.file);
        if(this.attendenceForm.value.starting_km) formData.append('starting_km', this.attendenceForm.value.starting_km)
          formData.append('punch_in_location', `${position.coords.latitude},${position.coords.longitude}`)
        
        this.attendenceService.punchIn(formData).subscribe(
          () => {
            this.matdialogRef.close({result: true})
          },
          (error) => {
            alert(`'Error while clocking in', ${error.error.exception}`);
          }
        );
      });
    } else {
      alert(
        `Browser doesn't support location service. Please use other browser`
      );
    }
  }
  
  clockOut() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        const formData = new FormData();
        if(this.file) formData.append('file', this.file);
        if(this.attendenceForm.value.ending_km) formData.append('ending_km', this.attendenceForm.value.ending_km)
          formData.append('punch_out_location', `${position.coords.latitude},${position.coords.longitude}`)
        
        this.attendenceService.punchOut(formData).subscribe(
          () => {
            this.matdialogRef.close({result: true})
          },
          (error) => {
            alert(`'Error while clocking in', ${error.error.exception}`);
          }
        );
      });
    } else {
      alert(
        `Browser doesn't support location service. Please use other browser`
      );
    }
  }
  
  fetchLocation() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        this.location = `${position.coords.latitude},${position.coords.longitude}`
      })
    } else {
      alert('Failed to fetch location')
     }
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
    this.fileSize = '';
    this.uploadResult = '';
    this.fileName = '';
    this.uploadStatus = undefined;
    debugger
    this.file = event.dataTransfer?.files[0] || event.target?.files[0];
    if(this.file){
      this.fileName = this.file.name;
      this.fileSize = `${(this.file.size / 1024).toFixed(2)} KB`;
    }
    
  }


}
