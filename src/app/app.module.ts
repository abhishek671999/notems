import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { meAPIUtility, Utility } from './shared/site-variables';
import { HTTP_INTERCEPTORS, HttpClientModule, provideHttpClient } from '@angular/common/http';
import { AppComponent } from './app.component';
import { RouterModule, RouterOutlet } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AppRoutingModule, routingComponents } from './app.routes';
import { CommonModule } from '@angular/common';
import { AuthInterceptorService } from './shared/services/auth-interceptor.service';
import { SharedModulesModule } from './shared/services/shared-modules/shared-modules.module';
import { MatIcon } from '@angular/material/icon';
import { HeaderComponent } from './components/shared/header/header.component';
import { FooterComponent } from './components/shared/footer/footer.component';
import { SafePipe } from './shared/pipe/safe.pipe';


@NgModule({
  declarations: [
    routingComponents,
    FooterComponent
  ],
  imports: [
      RouterOutlet,
      FormsModule,
      ReactiveFormsModule,
      RouterModule,
    AppRoutingModule,
    CommonModule
    ],
  providers: [Utility, meAPIUtility, provideHttpClient(), { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptorService, multi: true}],
  bootstrap: [],
})
export class AppModule {}
