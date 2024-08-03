import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-pop-up-msg',
  templateUrl: './pop-up-msg.component.html',
  styleUrl: './pop-up-msg.component.css'
})
export class PopUpMsgComponent {
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private matdialogRef: MatDialogRef<PopUpMsgComponent>
  ) { }

  ngOnInit() {
    setTimeout(() => {
      this.matdialogRef.close()
    }, 4000);
  }
}
