import { CommonModule, NgClass } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { ArchwizardModule, WizardComponent } from '@rg-software/angular-archwizard';
import { WizardComponent as BaseWizardComponent } from '@rg-software/angular-archwizard';
import { BudgetService } from '../../../../core/services/budget/budget.service';
import { Budget } from '../../../../core/models/budget.model';
import feather from 'feather-icons';
import { BudgetType } from '../../../../core/models/budegt.type.model';
import { BudgetSubmissionDTO } from '../../../../core/models/BudgetSubmissionDTO.model';

@Component({
  selector: 'app-budget',
  standalone: true,
  imports: [RouterLink,
    CommonModule,
    ReactiveFormsModule,
    RouterLink,
    ArchwizardModule,
    ReactiveFormsModule,
  ],
  templateUrl: './budget.component.html',
  styleUrl: './budget.component.scss'
})
export class BudgetComponent {
  @ViewChild('wizardForm') wizardForm: WizardComponent;

  // Form Groups
  validationForm1: FormGroup;
  validationForm2: FormGroup;
  validationForm3: FormGroup;
  yearForm: FormGroup;

  // Form Submission Flags
  isForm1Submitted = false;
  isForm2Submitted = false;
  isForm3Submitted = false;
  isYearSubmitted = false;

  // Final Step Variables
  isSuccess = false;
  msg = '';
  proceed = '';

  // Store collected data
  private collectedData: { budgets: Map<string, number>; year: number | null } = {
    budgets: new Map<string, number>(),
    year: null
  };

  constructor(private fb: FormBuilder, private budgetService: BudgetService) {
    this.initForms();
  }

  private initForms(): void {
    // Form 1 - Formations
    this.validationForm1 = this.fb.group({
      budgetFormation: ['', [Validators.required, Validators.pattern(/^[1-9]\d*$/)]]
    });

    // Form 2 - Voyages
    this.validationForm2 = this.fb.group({
      budgetVoyage: ['', [Validators.required, Validators.pattern(/^[1-9]\d*$/)]]
    });

    // Form 3 - Autres
    this.validationForm3 = this.fb.group({
      budgetAutre: ['', [Validators.required, Validators.pattern(/^[1-9]\d*$/)]]
    });

    // Year Form
    this.yearForm = this.fb.group({
      year: ['', [Validators.required, Validators.min(2000), Validators.max(2100)]]
    });
  }

  // Form Getters
  get form1() { return this.validationForm1.controls; }
  get form2() { return this.validationForm2.controls; }
  get form3() { return this.validationForm3.controls; }
  get yearCtrl() { return this.yearForm.controls; }

  // Step Handlers
  form1Submit() {
    this.isForm1Submitted = true;
    if (this.validationForm1.valid) {
      this.collectedData.budgets.set(BudgetType.TRAINING, +this.validationForm1.value.budgetFormation);
      this.wizardForm.goToNextStep();
    }
  }

  form2Submit() {
    this.isForm2Submitted = true;
    if (this.validationForm2.valid) {
      this.collectedData.budgets.set(BudgetType.MISSION, +this.validationForm2.value.budgetVoyage);
      this.wizardForm.goToNextStep();
    }
  }

  form3Submit() {
    this.isForm3Submitted = true;
    if (this.validationForm3.valid) {
      this.collectedData.budgets.set(BudgetType.OTHER, +this.validationForm3.value.budgetAutre);
      this.wizardForm.goToNextStep();
    }
  }

  submitYear() {
    this.isYearSubmitted = true;
    if (this.yearForm.valid) {
      this.collectedData.year = +this.yearForm.value.year;
      this.submitAllBudgets();
    }
  }

  private submitAllBudgets() {
    if (this.collectedData.year === null) {
      throw new Error('Year must not be null');
    }
    const payload: BudgetSubmissionDTO = {
      year: this.collectedData.year,
      budgets: this.collectedData.budgets
    };

    this.budgetService.uploadBudgets(payload).subscribe({
      next: (response) => {
        this.isSuccess = true;
        this.msg = 'Les budgets ont été enregistrés avec succès!';
        this.proceed = 'Continuer vers les formations';
        this.wizardForm.goToNextStep();
      },
      error: (err) => {
        this.isSuccess = false;
        this.msg = err.error?.message || 'Erreur lors de l\'enregistrement des budgets';
        this.wizardForm.goToNextStep();
      }
    });
  }

  finishFunction() {
    // Optional cleanup or navigation
  }
}
