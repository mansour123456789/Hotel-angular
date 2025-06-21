import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from '../navbar/navbar.component';

@Component({
  selector: 'app-authh',
  imports: [RouterOutlet,NavbarComponent],
  templateUrl: './authh.component.html',
  styleUrl: './authh.component.css'
})
export class AuthhComponent {

}
