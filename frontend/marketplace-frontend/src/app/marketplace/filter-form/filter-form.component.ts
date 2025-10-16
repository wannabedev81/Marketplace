import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatOptionModule } from '@angular/material/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';


@Component({
  selector: 'app-filter-form',
  imports: [CommonModule, MatFormFieldModule, MatInputModule, MatSelectModule, MatOptionModule, MatButtonModule, MatDialogModule, ReactiveFormsModule],
  templateUrl: './filter-form.component.html',
  
})
export class FilterFormComponent {
  filterForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<FilterFormComponent>
  ) {
    this.filterForm = this.fb.group({
      priceMin: [null],
      priceMax: [null],
      title: [''],
      sizes: [[]]
    });
  }

  onApply() {
    console.log('Apply clicked:', this.filterForm.value); //to debug application of the function
    this.dialogRef.close(this.filterForm.value);
  }

  onCancel() {
    this.dialogRef.close();
  }
}
