import { CommonModule, NgClass } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { ArchwizardModule } from '@rg-software/angular-archwizard';
import { WizardComponent as BaseWizardComponent } from '@rg-software/angular-archwizard';
import { BudgetService } from '../../../../core/services/budget/budget.service';
import { Budget } from '../../../../core/models/budget.model';
import feather from 'feather-icons';

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
export class BudgetComponent implements OnInit {

  budget!: any;
  validationForm1: UntypedFormGroup;
  validationForm2: UntypedFormGroup;
  validationForm3: UntypedFormGroup;
  msg: string = '';
  proceed: string = '';
  isSuccess: boolean = false;
  isForm1Submitted: Boolean;
  isForm2Submitted: Boolean;
  isForm3Submitted: Boolean;
  isErrorState: boolean = false;

  @ViewChild('wizardForm') wizardForm: BaseWizardComponent;

  constructor(public formBuilder: UntypedFormBuilder, private budgetService: BudgetService) { }

  ngOnInit(): void {

    /**
     * form1 value validation
     */
    this.validationForm1 = this.formBuilder.group({
      budgetFormation: ['', [Validators.pattern("^[0-9]+(\\.[0-9]{1,2})?$")]],
    });

    /**
     * formw value validation
     */
    this.validationForm2 = this.formBuilder.group({
      budgetVoyage: ['', [Validators.pattern("^[0-9]+(\\.[0-9]{1,2})?$")]],
    });

    this.validationForm3 = this.formBuilder.group({
      budgetAutre: ['', [Validators.pattern("^[0-9]+(\\.[0-9]{1,2})?$")]],
    });

    this.isForm1Submitted = false;
    this.isForm2Submitted = false;
    this.isForm3Submitted = false;

  }


  /**
   * Wizard finish function
   */

  finishFunction() {
    const formValues = {
      TRAINING: this.validationForm1.value.budgetFormation,
      MISSION: this.validationForm2.value.budgetVoyage,
      OTHER: this.validationForm3.value.budgetAutre,
    };

    const budgets: Budget['budgets'] = {};

    for (const [key, value] of Object.entries(formValues)) {
      if (value !== null && value !== '' && !isNaN(value)) {
        budgets[key as keyof Budget['budgets']] = parseFloat(value);
      }
    }

    const budget: Budget = { budgets };

    this.budgetService.saveBudget(budget).subscribe(
      (response) => {
        this.budget = response;
        this.msg = 'Les budgets ont été enregistrés avec succès.';
        this.proceed = 'Vous pouvez maintenant importer les données.';
        this.isSuccess = true;
        this.isErrorState = false;
      },
      (error) => {
        this.msg = 'Erreur lors de l’enregistrement des budgets.';
        this.proceed = '';
        this.isSuccess = false;
        this.isErrorState = true;
      }
    );
    console.log(this.isSuccess);
    
  }

  /**
   * Returns form
   */
  get form1() {
    return this.validationForm1.controls;
  }


  /**
   * Returns form
   */
  get form2() {
    return this.validationForm2.controls;
  }

  get form3() {
    return this.validationForm3.controls;
  }


  /**
   * Go to next step while form value is valid
   */
  form1Submit() {
    console.log('Form 1 submitted:', this.validationForm1.value);

    if (this.validationForm1.valid) {
      this.wizardForm.goToNextStep();
    }
    this.isForm1Submitted = true;
  }


  /**
   * Go to next step while form value is valid
   */
  form2Submit() {
    console.log('Form 2 submitted:', this.validationForm2.value);

    if (this.validationForm2.valid) {
      this.wizardForm.goToNextStep();
    }
    this.isForm2Submitted = true;
  }

  form3Submit() {
    console.log('Form 3 submitted:', this.validationForm3.value);
  
    const val1 = this.validationForm1.value.budgetFormation;
    const val2 = this.validationForm2.value.budgetVoyage;
    const val3 = this.validationForm3.value.budgetAutre;
  
    const isAnyFilled = [val1, val2, val3].some(val => val !== null && val !== '' && !isNaN(val));
  
    if (!isAnyFilled) {
      this.msg = 'Veuillez saisir au moins un budget avant de continuer.';
      this.proceed = '';
      this.isSuccess = false;
      this.wizardForm.goToNextStep(); // Still go to next step (to show error UI)
      return;
    }
  
    if (this.validationForm3.valid) {
      this.isSuccess = true;
      console.log(this.isSuccess, 'success');
      this.isErrorState = false;
      this.msg = 'gooo';
      this.wizardForm.goToNextStep(); 
      
      setTimeout(() => {
        feather.replace();
      });
    }
    this.isForm3Submitted = true;

  }
}
