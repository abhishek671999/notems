import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-confirmation-box',
  templateUrl: './confirmation-box.component.html',
  styleUrl: './confirmation-box.component.css'
})
export class ConfirmationBoxComponent {
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private matdialogRef: MatDialogRef<ConfirmationBoxComponent>
  ) { }
  
  confirmed() {
    this.matdialogRef.close({ result: true})
  }

  rejected() {
    this.matdialogRef.close({ result: false})
  }
}
