import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';

@Component({
  selector: 'app-error',
  standalone: true,
  imports: [
    RouterLink
  ],
  templateUrl: './error.component.html'
})
export class ErrorComponent implements OnInit {

  type: string | null;
  title: string;
  desc: string;

  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.type = this.route.snapshot.paramMap.get('type');
    
    switch(this.type) {
      case '403':
        this.title = 'Interdit';
        this.desc = 'Vous n\'avez pas l\'autorisation d\'accéder à cette page.'
        break;  
      case '404':
        this.title = 'Page non trouvée';
        this.desc = 'La page que vous recherchez n\'existe pas ou a été supprimée.'
        break;
      case '500':
        this.title = 'Erreur interne du serveur';
        this.desc = 'Une erreur s\'est produite sur le serveur. Veuillez réessayer plus tard.'
        break;
      default:
        this.type = 'Ooops..';
        this.title = 'Erreur';
        this.desc = 'Une erreur s\'est produite. Veuillez réessayer plus tard.'
        break;
      }
  }

}
