import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class DataService {
  private readonly http = inject(HttpClient);

  public getData(): Observable<any> {
    return this.http.get(`./assets/files/sample.json`, {responseType: 'text'})
  }
}
