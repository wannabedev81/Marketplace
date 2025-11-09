import { Component, OnInit } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { MatToolbar } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { ListingFormComponent } from './listing-form/listing-form.component';
import { FilterService } from '../services/filter.service';
import { FilterFormComponent } from './filter-form/filter-form.component';
import { AuthService } from '../services/auth.service';
import { DressService } from '../services/dress.service';
import { WeddingDress } from '../models/wedding-dress.model';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-marketplace',
  standalone: true,
  imports: [MatToolbar, MatButtonModule, MatIconModule, MatDialogModule, RouterOutlet, CommonModule],
  templateUrl: './marketplace.component.html',
  styleUrls: ['./marketplace.component.scss'],
})
export class MarketplaceComponent implements OnInit {
  dresses: WeddingDress[] = [];
  

  carouselImages: string[] = [
    '/assets/background_lake.jpg',
    '/assets/FNR_6338.jpg',
    '/assets/FNR_7887-2.jpg',
    '/assets/FNR_8949-HDR.jpg'
  ];

  activeSlide = 0;
  slideInterval: ReturnType<typeof setInterval> | null = null;

  constructor(
    private router: Router,
    private filterService: FilterService,
    private dialog: MatDialog,
    public auth: AuthService,
    private dressService: DressService) {}

  ngOnInit(): void {
    this.reload();

    //applying filters
    this.filterService.getFilters().subscribe(() => {
      this.reload();
    });

    this.slideInterval = setInterval(() => this.nextSlide(), 5000);
  }

  reload(): void {
    this.dressService.getDresses().subscribe({
      next: (dresses) => {
        const filters = this.filterService.getCurrentFilters();
        const filteredDresses = dresses.filter(d => {
          let matches = true;
        
        //apply some filters - extendable
          if(filters.priceMin != null) {
            matches = matches && (+d.price >= filters.priceMin);
          }

          if (filters.priceMax != null) {
            matches = matches && (+d.price <= filters.priceMax);
            }

          if (filters.title && filters.title.trim() !== '') {
            matches = matches && d.title.toLowerCase().includes(filters.title.toLowerCase());
          }

          if (filters.sizes && filters.sizes.length > 0) {
            matches = matches && filters.sizes.includes(d.size);
          }
          
          return matches;
          });
          this.dressService.updateDresses(filteredDresses);
      },
      error: (err: any) => console.error('Failed to reload list', err),
    });
  }

  resetFilters() {
    this.filterService.resetFilters();
  }

  //open filters
  openFilterDialog() {
    const dialogRef = this.dialog.open(FilterFormComponent, {
      width: '400px',
      //data: this.filterService.getCurrentFilters()
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        console.log('Dialog result:', result);
        this.filterService.setFilters(result);
        this.reload();
        } else {
          console.log('Dialog closed without applying filters.');
        }
    });
  }

  //Add new dress to the list
  openAddNewDialog() {
    this.auth.getProfile().subscribe({
      next: () => {
        const dialogRef = this.dialog.open(ListingFormComponent, {
        width: '600px',
        maxHeight: '90vh',
        panelClass: 'custom-dialog',
        autoFocus: false,
        data: {
          currentRoute: this.router.url 
          }
        });
        
        dialogRef.afterClosed().subscribe(result => {
      if (result === 'reload') {
        this.reload();
        }
      });
    },
    error: () => {
      this.router.navigate(['/profile/login']);
    }
   });
  }

  nextSlide(): void {
    this.activeSlide = (this.activeSlide +1) % this.carouselImages.length;
  }

  prevSlide(): void {
    this.activeSlide = (this.activeSlide -1 + this.carouselImages.length) % this.carouselImages.length;
  }

  ngOnDestroy(): void {
    if (this.slideInterval) {
      clearInterval(this.slideInterval);
    }
  }

}
