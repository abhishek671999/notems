import { Component, Inject, inject, ViewChild } from '@angular/core';
import { AttendenceService } from '../../../../shared/services/attendence/attendence.service';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ImageCompressorService } from '../../../../shared/services/image-compressor/image-compressor.service';
import { catchError, of, switchMap } from 'rxjs';
import { ErrorMsgComponent } from '../error-msg/error-msg.component';

@Component({
  selector: 'app-capture-attendence',
  templateUrl: './capture-attendence.component.html',
  styleUrl: './capture-attendence.component.css'
})
export class CaptureAttendenceComponent {

  @ViewChild('clockInButton') clockInButton: any;
  @ViewChild('clockOutButton') clockOutButton: any;


  constructor(
    private attendenceService: AttendenceService,
    private matdialogRef: MatDialogRef<CaptureAttendenceComponent>,
    private formbuilder: FormBuilder,
    private imageCompressor: ImageCompressorService,
    private matdialog: MatDialog,
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
    if(this.clockInButton) this.clockInButton._elementRef.nativeElement.disabled = true
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        const formData = new FormData();
        if(this.attendenceForm.value.starting_km) formData.append('starting_km', this.attendenceForm.value.starting_km)
        formData.append('punch_in_location', `${position.coords.latitude},${position.coords.longitude}`)
        this.compressImageIfAvailable(this.file).pipe(
          switchMap((data: any) => {
            console.log('REceived ', data)
            if(data) formData.append('file', data);
            return this.attendenceService.punchIn(formData)
          }),
          catchError((error: any) => {
            if(this.file) formData.append('file', this.file)
              return this.attendenceService.punchIn(formData)
          })
        ).subscribe(
          (data) => {
            this.matdialogRef.close({result: true})
          },
          (error) => {
            console.log(error)
            if(this.clockOutButton) this.clockOutButton._elementRef.nativeElement.disabled = false
          }
        )
      });
    } else {
      alert(
        `Browser doesn't support location service. Please use other browser`
      );
    }
  }

  compressImageIfAvailable(image: File | null){
    if(image) return this.imageCompressor.compressImage(image)
    else return of(null)
  }
  
  clockOut() {
    if(this.clockOutButton) this.clockOutButton._elementRef.nativeElement.disabled = true
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        const formData = new FormData();
        if(this.attendenceForm.value.ending_km) formData.append('ending_km', this.attendenceForm.value.ending_km)
        formData.append('punch_out_location', `${position.coords.latitude},${position.coords.longitude}`)
        this.compressImageIfAvailable(this.file).pipe(
          switchMap((data: any) => {
            console.log('REceived ', data)
            if(data) formData.append('file', data);
            return this.attendenceService.punchOut(formData)
          }),
          catchError((error: any) => {
            if(this.file) formData.append('file', this.file)
              return this.attendenceService.punchOut(formData)
          })
      ).subscribe(
          (data) => {
            this.matdialogRef.close({result: true})
          },
          (error) => {
            console.log(error)
            if(this.clockOutButton) this.clockOutButton._elementRef.nativeElement.disabled = false
          }
        )

        
        // this.compressImageIfAvailable(this.file).subscribe(
        //   (data) => {

        //   },
        //   (error) => {
        //     formData.append('file', this.file);
        //     this.attendenceService.punchOut(formData).subscribe(
        //       () => {
        //         this.matdialogRef.close({result: true})
        //       },
        //       (error) => {
        //         if(this.clockOutButton) this.clockOutButton._elementRef.nativeElement.disabled = false
        //       }
        //     );
        //     this.matdialog.open(ErrorMsgComponent, {data: {msg: 'Error while compressing image'}})
        //     this.matdialogRef.close({result: false})
        //   }
        // )
        

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
    this.file = event.dataTransfer?.files[0] || event.target?.files[0];
    if(this.file){
      this.fileName = this.file.name;
      this.fileSize = `${(this.file.size / 1024).toFixed(2)} KB`;
    }
    
  }


}
