import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Token } from './token';
import { tap } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class Auth{
  private readonly API_URL = 'http://localhost:5213/api/auth';
  constructor(
    private http: HttpClient,
    private tokenService: Token
  ) {}

  register(data: {
    fullName: string;
    email: string;
    password: string;
  }) {
    return this.http.post(`${this.API_URL}/register`, data);
  }

  login(data: {
    email: string;
    password: string;
  }) {
    return this.http
      .post<{ token: string }>(`${this.API_URL}/login`, data)
      .pipe(
        tap(res => {
          localStorage.setItem('token', res.token);
          this.tokenService.setToken(res.token);
        })
      );
  }
  getUserId(): number {
    const userId = this.tokenService.getUserId(); 
    return userId ? parseInt(userId, 10) : 0;
  }

  //To filter "My Active Reviews" in the UI
  getUserName(): string | null {
    return this.tokenService.getUserName();
  }

  logout(): void {
    this.tokenService.removeToken();
  }
  getUserRole(): string | null {
    return this.tokenService.getRole();
  }
}
