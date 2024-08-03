import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MeService } from '../../../shared/services/register/me.service';
import { Router } from '@angular/router';
import { meAPIUtility } from '../../../shared/site-variables';
import { MatDialog } from '@angular/material/dialog';
import { atLeastOne } from '../../../shared/utils/form-validators';
import { SuccessMsgComponent } from '../dialog-box/success-msg/success-msg.component';
import { PopUpMsgComponent } from '../pop-up-msg/pop-up-msg.component';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export class ProfileComponent {
  constructor(
    private fb: FormBuilder,
    private meService: MeService,
    private router: Router,
    private meUtility: meAPIUtility,
    private dialog: MatDialog
  ) {
    this.profileForm = this.fb.group({
      firstName: ['', [Validators.required]],
      mobileNumber: ['', [Validators.maxLength(13)]],
      email: ['', ],
    },
      { Validators: atLeastOne(Validators.required, ['email', 'mobileNumber']) })
   }
  
  public profileForm: FormGroup;
  public meData: any;

  ngOnInit() {
    this.meService.getMyInfo().subscribe(
      (data) => {
        this.meData = data;
        if (!this.meData['first_name']) this.dialog.open(PopUpMsgComponent, {
          data:
            { title: 'Complete profile' , msg: "Please fill your profile info"}
        })
        this.updateForm();
        this.meUtility.setMeData(this.meData);
      },
      (error) => {
        console.log('Error in fetching me data');
      }
    );
  }

  updateForm() {
    this.profileForm.setValue({
      firstName: this.meData['first_name'] || '',
      mobileNumber: this.meData['mobile'] || '',
      email: this.meData['email'] || '',
    });

    this.meData['email']
      ? this.profileForm.controls['email'].disable()
      : this.profileForm.controls['mobileNumber'].disable();
  }

  submitForm() {
    console.log('Form submmited', this.profileForm);
    let body: any = {
      name: this.profileForm.value.firstName,
      address: this.profileForm.value.address,
    };
    if (this.meData['email']) {
      body['mobile'] = this.profileForm.value.mobileNumber;
    } else if (this.meData['mobile']) {
      body['email'] = this.profileForm.value.email;
    }
    this.meService.updateUserDetails(body).subscribe(
      (data) => {
        console.log('Data: ', data);
        this.meData['address'] = this.profileForm.value.address || '';
        this.meData['first_name'] = this.profileForm.value.firstName;
        this.meUtility.setMeData(this.meData);
        this.dialog.open(SuccessMsgComponent, {
          data: { msg: 'Profile Updated' },
        });
        this.router.navigate(['home/']);
      },
      (error) => {
        console.log('error', error);
        alert('Error');
      }
    );
  }

  showFieldifNot(val: string) {
    console.log(
      this.profileForm.getRawValue()[val],
      this.profileForm.getRawValue()
    );
    return !Boolean(this.profileForm.getRawValue()[val]);
  }
}
