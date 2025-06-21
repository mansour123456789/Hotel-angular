import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AuthhRoutingModule } from './authh-routing.module';
import { HttpClientModule } from '@angular/common/http'; 
import { HttpClient, provideHttpClient } from '@angular/common/http';
import { AuthService } from '../services/auth.service';


@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    AuthhRoutingModule,
    HttpClientModule,
  ],
  providers: [AuthService,]
})
export class AuthhModule { }
