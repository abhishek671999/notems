import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { errorMsg } from '../../../../shared/custom_dtypes/interactions';

@Component({
  selector: 'app-error-msg',
  standalone: true,
  imports: [MatDialogModule],
  templateUrl: './error-msg.component.html',
  styleUrl: './error-msg.component.css',
})
export class ErrorMsgComponent {
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: errorMsg,
    private matDialogRef: MatDialogRef<ErrorMsgComponent>
  ) {}

  ngOnInit() {
    setTimeout(() => {
      this.matDialogRef.close();
    }, 10000);
  }
}
