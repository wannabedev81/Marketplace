import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export interface Filter {
  priceMin?: number | null;
  priceMax?: number | null;
  title?: string;
  sizes?: string[];
}

@Injectable({
  providedIn: 'root'
})
export class FilterService {
  private filters = new BehaviorSubject<Filter>({
    priceMin: null,
    priceMax: null,
    title: '',
    sizes: []
  });

  setFilters(filters: Filter): void {
    console.log('updating filters:', filters);
    this.filters.next(filters);
  }

  getFilters(): Observable<Filter> {
    return this.filters.asObservable();
  }

  resetFilters() {
    console.log('Filters have been reset'); //just for debug
    this.filters.next({
      priceMin: null,
      priceMax: null,
      title: '',
      sizes: []
    });

  }

  getCurrentFilters(): Filter {
    return this.filters.value;
  }
  
}
