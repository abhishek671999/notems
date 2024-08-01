import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HomescreenRoutingModule } from './homescreen-routing.module';
import { HomeComponent } from './home/home.component';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Login2Component } from './login2/login2.component';
import { LoginComponent } from './login/login.component';
import { RouterModule } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';


@NgModule({
  declarations: [
    HomeComponent,
    HeaderComponent,
    FooterComponent,
    Login2Component,
    LoginComponent
  ],
  imports: [
    CommonModule,
    HomescreenRoutingModule,
    ReactiveFormsModule,
    FormsModule,
  ],
  providers: [provideHttpClient()]
})
export class HomescreenModule { }
