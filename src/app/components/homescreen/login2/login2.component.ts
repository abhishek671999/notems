import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { LoginService } from '../../../shared/services/register/login.service';
import { Router } from '@angular/router';
import { Utility } from '../../../shared/site-variables';
import { SignupService } from '../../../shared/services/register/signup.service';
import { interval, Observable, PartialObserver, Subject, takeUntil } from 'rxjs';
import { sixDigitValidator } from '../../../shared/utils/form-validators';

@Component({
  selector: 'app-login2',
  templateUrl: './login2.component.html',
  styleUrl: './login2.component.css'
})
export class Login2Component {
  constructor(
    private _fb: FormBuilder,
    private _loginService: LoginService,
    private _router: Router,
    private _utility: Utility,
    private _signUpService: SignupService
  ) {

    this.loginObj = this._fb.group({
      username: new FormControl({ value: '', disabled: false }, [Validators.required, Validators.minLength(4), Validators.pattern(this.regex),]),
      otp: new FormControl('', [Validators.required, sixDigitValidator()]),
    });

    this.timer = interval(1000)
    .pipe(
      takeUntil(this.ispause)
    );

    this.timerObserver = {
      next: (_: number) => {  
        if(this.time == 0){
          this.ispause.next;
          this.resendOTP = true
        } else {
          this.time -= 1;
        }
      }
    };
    
  }
  ispause = new Subject();
  public resend_otp_time = 5 // seconds
  public time = this.resend_otp_time;
  timer: Observable<number>;
  timerObserver: PartialObserver<number>;

  secondsToHms(d: any) {
    d = Number(d);
    var m = Math.floor(d % 3600 / 60);
    var s = Math.floor(d % 3600 % 60);

    var mDisplay = m > 0 ? m + (m == 1 ? ": " : " : ") : "00 : ";
    var sDisplay = s > 0 ? s + (s == 1 ? "" : "") : "00";
    return mDisplay + sDisplay ; 
  }

  
  resendOTP = true
  goOn() {
    if(this.resendOTP){
      this.resendOTP = false
      this.time = this.resend_otp_time
      this.timer.subscribe(this.timerObserver);
    }
  }

  regex = new RegExp(
    '^([a-zA-Z0-9_.-])+@(([a-zA-Z0-9-])+.)+([a-zA-Z0-9]{2,4})|(^[0-9]{10})+$'
  );
  hide = true;
  loginObj: FormGroup

  get loginFormControl() {
    return this.loginObj.controls;
  }

  ngOnInit() {
    if (this._loginService.isLoggedIn()) {
      this._router.navigate(['/home'])
    }
  }

  logIn(){
    this.loginFormControl['username'].enable()
    this._signUpService.validateUser(this.loginObj.value.username, this.loginObj.value.otp).subscribe(
      (data) => {
        console.log('Success!!', data);
        this._utility.setToken(data['token'])
        console.log('Redirecting');
        this._router.navigate(['home']);
      },
      (error) => {
        alert('Invalid user id or password')
        this.freezeEmail = true
      }
    );
  }

  editEmail() {
    console.log('edit mail called')
    this.freezeEmail = false
    this.disableLogin = false
    this.loginFormControl['username'].enable()
    this.loginFormControl['otp'].disable()
  }

  freezeEmail = false
  disableLogin = false
  authUser() {
      this.disableLogin = true
      this.loginFormControl['username'].enable()
      this._signUpService.authUser(this.loginObj.value.username).subscribe(
        (data) => {
          this.freezeEmail = true
          this.loginFormControl['username'].disable()
          this.loginFormControl['otp'].enable()
          this.goOn()
        },
        (error) => {
          console.log('Error in authUser: ', error);
          alert(error.error);
        }
      );
  }
}
