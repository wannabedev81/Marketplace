import { Component, OnInit } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment.dev';
import { HttpClient } from '@angular/common/http';
import { DressService } from '../services/dress.service';
import { MatCardModule } from '@angular/material/card';
import { WeddingDress } from '../models/wedding-dress.model';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [RouterOutlet, CommonModule, RouterLink, RouterLinkActive, MatCardModule, MatButtonModule],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
  apiBaseUrl = environment.apiBaseUrl;
  profile: any = null; 
  errorMessage: string = '';
  userItems: any[] = [];
  isLoading: boolean = true;

  constructor(
    public auth: AuthService,
    private router: Router,
    private http: HttpClient,
    private dressService: DressService
    ) {}

  ngOnInit(): void {
    this.auth.getProfile().subscribe({
      next: (data) => {
        this.profile = data;
      },
      error: (err) => {
        console.error(err);
        this.errorMessage = 'Unable to load profile';
      }
    });
    this.loadUserItems();
  }

  logout(): void {
    this.auth.logout();
    this.profile = null;
  }

  deleteProfile(): void {
    if (confirm('Are you sure you want to delete your profile? This action cannot be undone.' )) {
      this.auth.deleteProfile().subscribe({
        next: () => {
          alert('Your profile has been deleted.');
          this.router.navigate(['/']);
        },
        error: (err) => {
          console.error('Failed to delete profile: ', err);
          alert('Failed to delete profile. Please try again later.' );
        }
      });
    }
  }

    loadUserItems(): void {
      this.http.get<WeddingDress[]>(`${this.apiBaseUrl}/api/items/my-items`, { withCredentials: true }).subscribe({
        next: (items) => {
          this.userItems = items;
          this.isLoading = false;
        },
        error: (err) => {
          console.error('Error fetching user items. ', err);
          this.isLoading = false;
        }
      });
    }

  deleteItem(id: number): void {
    if (confirm('Are you sure you want to delete this item?')) {
      this.dressService.deleteDress(id).subscribe({
        next: () => {
          this.userItems = this.userItems.filter(item => item.id !== id);
          alert('Item deleted successfully');
        },
        error: (err) => {
          console.error('Failed to delete item', err);
          alert('Could not delete item. Please try again later. ');
        }
      });
    }
  }
}
