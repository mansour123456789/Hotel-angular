import { isPlatformBrowser } from '@angular/common';
import { Component, Inject, OnDestroy, OnInit, PLATFORM_ID, Renderer2 } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-navbaradmin',
  imports: [RouterModule],
  templateUrl: './navbaradmin.component.html',
  styleUrl: './navbaradmin.component.css'
})
export class NavbaradminComponent implements OnInit {
  private scriptElements: HTMLScriptElement[] = [];
  constructor(private renderer: Renderer2 , @Inject(PLATFORM_ID) private platformId: Object,private authService: AuthService, private router: Router)  { }

  ngOnInit(): void {
    // Ajouter les balises <link> dynamiquement dans le <head> du document
    if (isPlatformBrowser(this.platformId)) {
 // Supprimer ces scripts s'ils existent déjà
 this.removeScriptFromBody('js/jquery-3.3.1.min.js');
 this.removeScriptFromBody('js/bootstrap.min.js');
 this.removeScriptFromBody('js/plugin.js');
 this.removeScriptFromBody('js/main.js');
 this.removeScriptFromBody('js/custom-nav.js');
 this.removeScriptFromBody('js/custom-swiper1.js');
 this.removeScriptFromBody('js/custom-singledate.js');

 // Ajouter les scripts dynamiquement
 this.addScriptToBody('assets/vendors/core/core.js');

 this.addScriptToBody('assets/vendors/chartjs/Chart.min.js');
 this.addScriptToBody('assets/vendors/jquery.flot/jquery.flot.js');
 this.addScriptToBody('assets/vendors/jquery.flot/jquery.flot.resize.js');
 this.addScriptToBody('assets/vendors/bootstrap-datepicker/bootstrap-datepicker.min.js');
 this.addScriptToBody('assets/vendors/apexcharts/apexcharts.min.js');

 this.addScriptToBody('assets/vendors/feather-icons/feather.min.js');
 this.addScriptToBody('assets/js/template.js');

 this.addScriptToBody('assets/js/dashboard-light.js');
 this.addScriptToBody('assets/js/datepicker.js');

      
    this.addLinkToHead('https://fonts.googleapis.com', 'preconnect');
    this.addLinkToHead('https://fonts.gstatic.com', 'preconnect');
    this.addLinkToHead('https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;500;700;900&display=swap', 'stylesheet');
    this.addLinkToHead('assets/vendors/core/core.css', 'stylesheet');
    this.addLinkToHead('assets/vendors/bootstrap-datepicker/bootstrap-datepicker.min.css', 'stylesheet');
    this.addLinkToHead('assets/fonts/feather-font/css/iconfont.css', 'stylesheet');
    this.addLinkToHead('assets/css/style.css', 'stylesheet');
   
      this.removeLinkFromHead('css/bootstrap.min.css');
      this.removeLinkFromHead('css/default.css');
      this.removeLinkFromHead('css/style.css');
      this.removeLinkFromHead('css/plugin.css');
      this.removeLinkFromHead('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css');
      this.removeLinkFromHead('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.11.2/css/all.min.css');}
  
  }

  removeLinkFromHead(href: string): void {
    const links = document.querySelectorAll(`link[href="${href}"]`);
    links.forEach(link => {
      this.renderer.removeChild(document.head, link);
    });
  }


  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
  // Fonction pour ajouter une balise <link>
  addLinkToHead(href: string, rel: string): void {
    const link = this.renderer.createElement('link');
    this.renderer.setAttribute(link, 'rel', rel);
    this.renderer.setAttribute(link, 'href', href);
    this.renderer.appendChild(document.head, link);
  }
  private addScriptToBody(src: string): void {
    const script = this.renderer.createElement('script');
    this.renderer.setAttribute(script, 'src', src);
    this.renderer.setAttribute(script, 'type', 'text/javascript');
    script.defer = true; // Permet d'éviter les erreurs de chargement
    
    this.renderer.appendChild(document.body, script);
    this.scriptElements.push(script); // Stocker les scripts pour suppression ultérieure
  }
  private removeScriptFromBody(src: string): void {
    const scripts = document.querySelectorAll(`script[src="${src}"]`);
    scripts.forEach(script => {
      if (script.parentNode) {
        this.renderer.removeChild(document.body, script);
      }
    });
  }
}
