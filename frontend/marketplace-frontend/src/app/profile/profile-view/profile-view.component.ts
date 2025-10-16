import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-profile-view',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './profile-view.component.html',
  styleUrls: ['./profile-view.component.scss']
})
export class ProfileViewComponent implements OnInit {
  userEmail: string | null = null;
  errorMessage: string | null = null;

  constructor(public auth: AuthService) {}

  ngOnInit(): void {
    this.auth.getProfile().subscribe({
      next: (data) => {
        this.userEmail = data?.email || null;
      },
      error: () => {
        this.userEmail = null;
        this.errorMessage = 'Unable to load profile';
      }
    });
  }
}
