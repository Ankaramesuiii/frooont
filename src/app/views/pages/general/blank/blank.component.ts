import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import Swal from 'sweetalert2';
import { UploadService } from '../../../../core/services/upload-file/upload.service';
import { AuthService } from '../../../../core/services/auth/auth.service';

@Component({
  selector: 'app-blank',
  standalone: true,
  imports: [
    RouterLink
  ],
  templateUrl: './blank.component.html',
})
export class BlankComponent implements OnInit {

  isLoading = false;
  selectedFile: File | null = null;
  errorMessage = '';
  messages: string[] = [
    "Préparation du fichier",
    "Analyse des données",
    "Validation en cours",
    "Importation en cours",
    "Finalisation"
  ];
  currentMessageIndex: number = 0;
  currentMessage = this.messages[0]; // Message initial
  intervalId: any;

  constructor(private uploadService: UploadService, private authService: AuthService) {}

  ngOnInit() {}

  uploadFile(event: any) {
    const file = event.target.files[0];

    if (!file) {
      this.errorMessage = 'Veuillez sélectionner un fichier !';
      return;
    }

    const validTypes = [
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', // .xlsx
      'application/vnd.ms-excel' // .xls
    ];

    if (!validTypes.includes(file.type) && !file.name.match(/\.(xls|xlsx)$/i)) {
      this.errorMessage = 'Type de fichier invalide ! Veuillez choisir un fichier Excel (.xls ou .xlsx).';
      this.selectedFile = null;
      return;
    }

    this.selectedFile = file;
    this.errorMessage = ''; // Clear any previous error
  }

  submitFile() {
    if (!this.selectedFile) {
      this.errorMessage = 'Veuillez sélectionner un fichier Excel valide !';
      return;
    }
  
    this.isLoading = true; // Afficher le loader
    this.errorMessage = ''; // Clear previous errors

    // Lancer l'animation du message
    this.startMessageRotation();

    this.uploadService.uploadFile(this.selectedFile).subscribe({
      next: (res) => {
        this.isLoading = false; // Cacher le loader
        clearInterval(this.intervalId); // Stopper la rotation des messages

        Swal.fire({
          title: 'Importation Réussie!',
          text: 'Le fichier a été importé avec succès.',
          icon: 'success',
          confirmButtonText: 'Fermer'
        });
      },
      error: (err) => {
        this.isLoading = false; // Cacher le loader
        clearInterval(this.intervalId); // Stopper la rotation des messages

        this.handleError(err.message || 'Une erreur s\'est produite lors de l\'importation du fichier.');
      }
    });
  }

  startMessageRotation() {
    this.currentMessageIndex = 0;
    this.currentMessage = this.messages[this.currentMessageIndex];

    this.intervalId = setInterval(() => {
      this.currentMessageIndex = (this.currentMessageIndex + 1) % this.messages.length;
      this.currentMessage = this.messages[this.currentMessageIndex];
    }, 2000);
  }

  private handleError(message: string) {
    Swal.fire({
      title: 'Échec de l\'importation',
      text: message,
      icon: 'error',
      confirmButtonText: 'Fermer'
    });
  }
}
