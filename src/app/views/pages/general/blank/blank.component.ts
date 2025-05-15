import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import Swal from 'sweetalert2';
import { UploadService } from '../../../../core/services/upload-file/upload.service';
import { AuthService } from '../../../../core/services/auth/auth.service';

@Component({
  selector: 'app-blank',
  standalone: true,
  imports: [RouterLink],
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
  currentMessage = this.messages[0];
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
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'application/vnd.ms-excel'
    ];

    if (!validTypes.includes(file.type) && !file.name.match(/\.(xls|xlsx)$/i)) {
      this.errorMessage = 'Type de fichier invalide ! Veuillez choisir un fichier Excel (.xls ou .xlsx).';
      this.selectedFile = null;
      return;
    }

    this.selectedFile = file;
    this.errorMessage = '';
  }

  submitFile() {
    if (!this.selectedFile) {
      this.errorMessage = 'Veuillez sélectionner un fichier Excel valide !';
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';
    this.currentMessageIndex = 0;
    this.currentMessage = this.messages[0];

    this.startMessageRotation(() => {
      // Only triggered after final message is displayed
      this.uploadService.uploadFile(this.selectedFile!).subscribe({
        next: (res) => {
          this.isLoading = false;
          Swal.fire({
            title: 'Importation Réussie!',
            text: res.warning? res.warning : 'Le fichier a été importé avec succès.',
            icon: 'success',
            confirmButtonText: 'Fermer'
          });
        },
        error: (err) => {
          this.isLoading = false;
          this.handleError(err.message || 'Une erreur s\'est produite lors de l\'importation du fichier.');
        }
      });
    });
  }

  startMessageRotation(onComplete: () => void) {
    this.intervalId = setInterval(() => {
      this.currentMessageIndex++;

      if (this.currentMessageIndex < this.messages.length - 1) {
        this.currentMessage = this.messages[this.currentMessageIndex];
      } else {
        // Show "Finalisation" and stop rotating
        clearInterval(this.intervalId);
        this.currentMessage = this.messages[this.messages.length - 1];

        // Wait a bit before proceeding (optional)
        setTimeout(() => {
          onComplete();
        }, 1000); // Small delay after "Finalisation"
      }
    }, 5000); // 5 seconds between messages
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
