import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-inicio',
  templateUrl: './inicio.component.html',
  styleUrls: ['./inicio.component.scss']
})
export class InicioComponent implements OnInit {
  showCookieBanner = true; // Mostrar el banner de cookies por defecto

ngOnInit() {
  const cookieConsent = this.getCookie('cookieConsent');
  if (cookieConsent) {
    this.showCookieBanner = false; // Si ya hay consentimiento, no mostrar el banner
  }
}

//Funcion que acepta las cookies
acceptCookies() {
  this.setCookie('cookieConsent', 'Aceptadas', 1);
  this.showCookieBanner = false;
}

//Funcion que reclina las cookies
declineCookies() {
  alert('Debes aceptar las cookies para acceder al sitio web.');
  this.showCookieBanner = true;
}

// Método para establecer una cookie con duración
setCookie(name: string, value: string, days: number) {
  const date = new Date();
  date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000); // Duración en milisegundos
  const expires = `expires=${date.toUTCString()}`;
  document.cookie = `${name}=${value};${expires};path=/`;
}

// Método para obtener una cookie
getCookie(name: string): string | null {
  const cookies = document.cookie.split('; ');
  for (let cookie of cookies) {
    const [key, value] = cookie.split('=');
    if (key === name) {
      return value;
    }
  }
  return null;
}
}
