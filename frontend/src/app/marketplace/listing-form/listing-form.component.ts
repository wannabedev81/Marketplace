import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { DressService } from '../../services/dress.service';
import { MatFormFieldModule, MatFormFieldControl } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButton, MatButtonModule } from '@angular/material/button';
import { WeddingDress } from '../../models/wedding-dress.model';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MatOptionModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';



@Component({
  selector: 'app-listing-form',
  standalone: true, 
  imports: [ MatButtonModule, MatFormFieldModule, MatInputModule, ReactiveFormsModule, CommonModule, MatOptionModule, MatSelectModule],
  templateUrl: './listing-form.component.html',
  styleUrls: ['./listing-form.component.scss']
})
export class ListingFormComponent {
  

  form: FormGroup;
  message = '';

  //predefined selectables for the add new item form
  sizeOptions: string[] = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];
  conditionOptions: string[] = ['New', 'Like new', 'Used'];
  styleOptions: string[] = ['Classic', 'Mermaid', 'Modern', 'Vintage'];

  selectedFile: File | null = null;

  constructor(
    private dressService: DressService,
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<ListingFormComponent>,
    private router: Router
  ) { 

    this.form = this.fb.group({
      title: ['', Validators.required],
      size: ['', Validators.required],
      price: [null, Validators.required],
      condition: ['', Validators.required],
      imageUrl: [''],
      style: [''],
      location: [''],
      message: ['']
    });
   
  }

  //file selection
  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedFile = input.files[0];
      this.form.patchValue({ imageUrl: this.selectedFile.name });
  }
}


postListing() {
  if (this.form.invalid) {
    this.message = 'Title and price are required';
    return;
  }

  //sending formData instead of raw json data:
  const formData = new FormData;

  
  //append from fields
  Object.entries(this.form.value).forEach(([key, value]) => {
    if (value !== null && value !== undefined) {
      formData.append(key, value as any);
    }
  });

  //append file if selected: 
    if (this.selectedFile) {
      formData.append('image', this.selectedFile);
    }


  this.dressService.addDress(formData).subscribe({
    next: () => {
      this.message = 'Item posted successfully';
      this.dialogRef.close('reload');
    },
    error: (err) => {
      if (err.status === 401) {
        this.message = 'You need to be logged in to add an item';
        this.router.navigate(['/login']);
      } else {
        this.message = 'Failed to post new item';
      }
     }
  });
}

cancel() {
  this.dialogRef.close(false);
}

}
