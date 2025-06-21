import { Injectable } from '@angular/core';
import { Annonce } from './annonce';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AnnonceService {

  private annonces: Annonce[] = [
    {
      titre: 'Développeur Angular',
      description: 'Recherche développeur Angular expérimenté',
      entreprise: 'ABC Corp',
      datePublication: new Date()
    },
    {
      titre: 'Développeur React',
      description: 'Recherche développeur React expérimenté',
      entreprise: 'XYZ Ltd',
      datePublication: new Date()
    }
  ];

  constructor() { }

  getAnnonces(): Observable<Annonce[]> {
    return of(this.annonces);
  }
}
