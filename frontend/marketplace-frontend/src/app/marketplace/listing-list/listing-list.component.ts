import { Component, OnInit } from '@angular/core';
import { DressService } from '../../services/dress.service';
import { WeddingDress } from '../../models/wedding-dress.model';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { CurrencyPipe, NgFor } from '@angular/common';
import { FormGroup } from '@angular/forms';
import { environment } from '../../../environments/environment.dev';
import { CommonModule } from '@angular/common';




@Component({
  selector: 'app-listing-list',
  standalone: true,
  imports: [NgFor, MatCardModule, MatButtonModule, CurrencyPipe, CommonModule],
  templateUrl: './listing-list.component.html',
  styleUrls: ['./listing-list.component.scss']
})
export class ListingListComponent implements OnInit {
  dresses: WeddingDress[] = [];
  

  form!: FormGroup;

  apiBaseUrl = environment.apiBaseUrl;

  constructor(
    private dressService: DressService
    ) {}

  ngOnInit(): void {
    this.dressService.dresses$.subscribe(dresses => {
      this.dresses = dresses;
    });
  }
  

  loadDresses() {
    this.dressService.getDresses().subscribe({
      next: (data) => this.dresses = data,
      error: (err) => console.error('Error loading dresses:', err)
    });
   }

   getImageUrl(dress: WeddingDress): string {
    if (dress.images && dress.images.length > 0) {
      const img = dress.images.find(i => i.size === '600w' && i.format === 'jpg');
      if (img) {
        return `${this.apiBaseUrl}${img.path}`; 
      } 

      return `${this.apiBaseUrl}${dress.images[0].path}`;
      }

      if (dress.imageUrl) {
        return `${this.apiBaseUrl}${dress.imageUrl}`;
      }
      
      return 'assets/placeholder.jpg'
   }
}
