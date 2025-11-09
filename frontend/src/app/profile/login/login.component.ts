import { Component } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';


@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatInputModule, MatFormFieldModule, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  loginForm: FormGroup;
  errorMessage: string = '';

  constructor(
    private fb: FormBuilder, 
    private auth: AuthService,
    private router: Router,
    private dialogRef: MatDialogRef<LoginComponent>
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
    });
  }

  onSubmit() {    if (this.loginForm.invalid) return;


    if (this.loginForm.valid) {
      const { email, password } = this.loginForm.value;
      this.auth.login(email, password).subscribe({
        next: () => {
          this.dialogRef.close('logged-in')
          this.router.navigate(['/']);
        },
        error: () => {
          this.errorMessage = 'Invalid email or password';
        },
      });
    }
  }
}
