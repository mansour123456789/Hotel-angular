import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Component, Inject, OnInit, PLATFORM_ID, Renderer2 } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-navbar',
  imports: [RouterModule, CommonModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent implements OnInit {
  userInfo: any;
  constructor(private renderer: Renderer2,@Inject(PLATFORM_ID) private platformId: any,private authService: AuthService, private router: Router) { }

  ngOnInit(): void {
    this.loadUserInfo();
    
    // Ajouter les liens CSS dynamiquement
    this.addLinkToHead('css/bootstrap.min.css', 'stylesheet');
    this.addLinkToHead('css/default.css', 'stylesheet');
    this.addLinkToHead('css/style.css', 'stylesheet');
    this.addLinkToHead('css/plugin.css', 'stylesheet');
    this.addLinkToHead('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css', 'stylesheet');
    this.addLinkToHead('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.11.2/css/all.min.css', 'stylesheet');
  }

  // Fonction pour ajouter une balise <link>
  addLinkToHead(href: string, rel: string): void {
    const link = this.renderer.createElement('link');
    this.renderer.setAttribute(link, 'rel', rel);
    this.renderer.setAttribute(link, 'href', href);
    this.renderer.setAttribute(link, 'type', 'text/css');
    this.renderer.appendChild(document.head, link);
  }

 
  isLoggedIn(): boolean {
    return this.authService.isLoggedIn();
  }


  
  loadUserInfo(): void {
    this.userInfo = this.authService.getUserInfo();
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

}
