import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'marketplace',
    pathMatch: 'full'
  },
  {
    path: 'marketplace',
    loadComponent: () =>
      import('./marketplace/marketplace.component').then(m => m.MarketplaceComponent),
    children: [
      {
        path: '',
        loadComponent: () =>
          import('./marketplace/listing-list/listing-list.component').then(m => m.ListingListComponent)
      }
    ]
  },
  {
    path: 'profile',
    loadComponent: () =>
      import('./profile/profile.component').then(m => m.ProfileComponent),
    children: [
      {
        path: 'login',
        loadComponent: () =>
        import('./profile/login/login.component').then(m => m.LoginComponent)
      },
      {
        path: 'register',
        loadComponent: () =>
        import('./profile/register/register.component').then(m => m.RegisterComponent)
      },

      {
        path: 'logout',
        loadComponent: () =>
          import('./profile/logout/logout.component').then(m => m.LogoutComponent)
      },

      {
        path: '',
        loadComponent: () =>
        import('./profile/profile-view/profile-view.component').then(m => m.ProfileViewComponent)
      }
    ]
  }
];
