import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { jwtDecode } from 'jwt-decode'; 

@Injectable({
  providedIn: 'root',
})
export class Token {
  private readonly TOKEN_KEY = 'auth_token';
  private isBrowser: boolean;

  constructor(@Inject(PLATFORM_ID) platformId: Object) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

  setToken(token: string): void {
    if (this.isBrowser) {
      localStorage.setItem(this.TOKEN_KEY, token);
    }
  }

  getToken(): string | null {
    if (!this.isBrowser) return null;
    return localStorage.getItem(this.TOKEN_KEY);
  }

  removeToken(): void {
    if (this.isBrowser) {
      localStorage.removeItem(this.TOKEN_KEY);
    }
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  // ✅ Used to identify the officer for assignment
  getUserId(): string | null {
  const token = this.getToken();
  if (!token) return null;
  try {
    const decoded: any = jwtDecode(token);
    return decoded.nameid || 
           decoded['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier'] || 
           decoded.sub || 
           null;
  } catch (error) {
    console.error("Token decoding failed", error);
    return null;
  }
}

  
getUserName(): string | null {
  const token = this.getToken();
  if (!token) return null;
  try {
    const decoded: any = jwtDecode(token);
    return (
      decoded['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name'] || 
      decoded.unique_name || 
      decoded.name || 
      null
    );
  } catch (error) {
    console.error("Error decoding token for name:", error);
    return null;
  }
}
  getRole(): string | null {
    const token = this.getToken();
    if (!token) return null;

    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return (
        payload.role ||
        payload['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'] ||
        null
      );
    } catch {
      return null;
    }
  }
}