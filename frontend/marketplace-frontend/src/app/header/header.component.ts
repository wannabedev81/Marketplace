import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, Router } from '@angular/router';
import { RouterLinkActive } from '@angular/router';
import { MatToolbarModule} from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { AuthService } from '../services/auth.service';
import { LoginDialogComponent } from '../profile/login-dialog/login-dialog.component';
import { RegisterDialogComponent } from '../profile/register-dialog/register-dialog.component';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-header',
  imports: [CommonModule, RouterLink, RouterLink, RouterLinkActive, MatToolbarModule, MatButtonModule, MatMenuModule, MatDialogModule, MatIconModule],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  profile: any = null;

  constructor(
    public auth: AuthService, 
    private router: Router,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.auth.currentUser$.subscribe(user => {
      this.profile = user;
    });

    this.auth.getProfile().subscribe({
      next: (data) => (this.profile.data),
      error: () => (this.profile = null)
    });
  }

  logout(): void {
    this.auth.logout();
    this.router.navigate(['/']);
  }

  openLoginDialog(): void {
    this.dialog.open(LoginDialogComponent, { width: '400px' });
  }

  openRegisterDialog(): void {
    this.dialog.open(RegisterDialogComponent, { width: '400px' });
  }
}
