import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { WeddingDress } from '../models/wedding-dress.model';
import { environment } from '../../environments/environment.dev';



@Injectable({
  providedIn: 'root'})

export class DressService {
  private apiUrl = `${environment.apiBaseUrl}/api/items`;
  private dressesSubject = new BehaviorSubject<WeddingDress[]>([]);
  dresses$ = this.dressesSubject.asObservable();

  constructor(private http: HttpClient) {}

//get all dresses
  getDresses(): Observable<WeddingDress[]> {
    return this.http.get<WeddingDress[]>(this.apiUrl);
  }

  addDress(newDress: WeddingDress | FormData): Observable<any> {
    return this.http.post(this.apiUrl, newDress, {
      withCredentials: true
    });
  }

  updateDresses(dresses: WeddingDress[]): void {
    this.dressesSubject.next(dresses);
  }

  getCurrentDresses(): WeddingDress[] {
    return this.dressesSubject.value;
  }

  deleteDress(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`, { withCredentials: true });
  }

}
