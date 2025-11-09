import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, MatButtonModule, ReactiveFormsModule, MatInputModule, MatFormFieldModule],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent {
  registerForm: FormGroup;
  message = '';

  constructor(
    private fb: FormBuilder,
    private auth: AuthService,
    private router: Router
  ) {
    this.registerForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  onSubmit() {
    if (!this.registerForm.valid) return;
    
      const { email, password } = this.registerForm.value;
      this.auth.register(email, password).subscribe({
        next: () => {
          this.message = 'Registration successful! Redirecting to login..';
          setTimeout(() => this.router.navigate(['/profile/login']), 1500);
        },
        error: (err) => {
          console.error(err);
          this.message = err.error?.message || 'Registration failed.';
        }
      });
    }
  }

