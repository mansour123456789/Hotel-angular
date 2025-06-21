import { Component, OnInit, Renderer2 } from '@angular/core';
import { NavbarComponent } from '../navbar/navbar.component';

@Component({
  selector: 'app-home',
  imports: [NavbarComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit {

  constructor(private renderer: Renderer2) { }

  ngOnInit(): void {
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
}
