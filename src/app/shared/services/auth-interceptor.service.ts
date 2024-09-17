import { HttpErrorResponse, HttpEvent, HttpHandler, HttpHandlerFn, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { inject, Inject, Injectable } from '@angular/core';
import { host, meAPIUtility, Utility } from '../site-variables';
import { Router } from '@angular/router';
import { Observable, tap } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { ErrorMsgComponent } from '../../components/shared/dialog-box/error-msg/error-msg.component';

export function intercept(request: HttpRequest<unknown>, next: HttpHandlerFn): Observable<HttpEvent<unknown>> {
  const utility = inject(Utility)
  const router = inject(Router)
  const _meAPIUtility = inject(meAPIUtility)
  const matDialog = inject(MatDialog)

  let loggedInFlag = false
  let unAuthRequestsURLs = [host + 'rest-auth/login/', host + 'users/auth/token/', host + 'users/auth/email/', host + 'users/auth/mobile/',  ,  host + 'users/auth/mobile/']
  if (!unAuthRequestsURLs.includes(request.url)) {
    request = request.clone({headers: utility.getHeaders()})
  }
  return next(request).pipe(
    tap((event) => {
      loggedInFlag = true
    },
    error => {
      if(error instanceof HttpErrorResponse){
        console.log('intercepted event', error, request.url, error.status)
        if(error.status == 0){
          alert('Device not connected to Internet. Please check')
        } else if(error.status == 400 && error.error.description){
          matDialog.open(ErrorMsgComponent, {data: {msg: `${error.error.description}`}})
        }
         else if (error.status != 400 && error.error.detail?.toLowerCase().startsWith('invalid token')) {
          if (loggedInFlag) {
            loggedInFlag = false
            sessionStorage.clear();
            _meAPIUtility.removeMeData();
            router.navigate(['login']);
            alert('Session over. Please login')
           }
        }
        else if(error.status == 401 && request.url != host +'rest-auth/logout/'){
         router.navigate(['home'])
        }
      }
    }
    )
  );
}
