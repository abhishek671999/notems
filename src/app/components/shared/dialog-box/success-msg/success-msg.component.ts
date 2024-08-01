import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { successMsg } from '../../../../shared/custom_dtypes/interactions';

@Component({
  selector: 'app-success-msg',
  standalone: true,
  imports: [MatDialogModule],
  templateUrl: './success-msg.component.html',
  styleUrl: './success-msg.component.css',
})
export class SuccessMsgComponent {
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: successMsg,
    private matdialogRef: MatDialogRef<SuccessMsgComponent>
  ) {}

  ngOnInit() {
    setTimeout(() => {
      this.matdialogRef.close();
    }, 1000);
  }
}
