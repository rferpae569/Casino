import { Component, OnInit, AfterViewInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Usuarios } from '../model/usuarios';
import { ServicioService } from '../servicio.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-inicio',
  templateUrl: './inicio.component.html',
  styleUrls: ['./inicio.component.scss']
})
export class InicioComponent implements OnInit, AfterViewInit  {
  showCookieBanner = true; // Mostrar el banner de cookies por defecto
  newloginForm!: FormGroup;
  newlogin!: Usuarios;
  isLoggedIn = false;
  entrada: boolean = false;
  fallo: boolean = false;
  mostrarContrasena: boolean = false;
  
  constructor(
    private servicioService: ServicioService,
    private fb: FormBuilder,
    private router: Router
  ) {
    this.newloginForm = this.fb.group({
      Correo: ['', [Validators.required, Validators.email]],
      Passwrd: [
        '',
        [
          Validators.required,
          Validators.pattern(/^(?=.*[0-9])(?=.*\*)(?=.*[a-zA-Z])(.{8,})$/),
        ],
      ],
    });
  }
  
  get correo() {
    return this.newloginForm.get('Correo');
  }
  
  get passwrd() {
    return this.newloginForm.get('Passwrd');
  }
  
  ngAfterViewInit() {
    const sessionData = localStorage.getItem('session');
    if (sessionData) {
      this.isLoggedIn = true;
    }
  }
  
  entradalogin() {
    if (this.isLoggedIn && !this.passwrd?.value) {
      alert('Por seguridad, debes introducir la contraseña.');
      return;
    }
  
    if (this.newloginForm.invalid) {
      alert(
        'No has completado bien los campos. El correo debe ser válido y la contraseña debe tener al menos 8 caracteres (Letras y números).'
      );
      return;
    }
  
    this.newlogin = this.newloginForm.value;
    this.servicioService.login(this.newlogin).subscribe((data: any[]) => {
      if (data && data.length > 0) {
        const sessionData = {
          correo: data[0].Correo, // Cambiado para usar Correo
          expiration: new Date().getTime() + 24 * 60 * 60 * 1000, // Expira en 1 día
        };
        localStorage.setItem('session', JSON.stringify(sessionData));
  
        this.isLoggedIn = true;
        this.router.navigateByUrl('Eleccion');
      } else {
        this.fallo = true;
        alert('Los campos no coinciden con el usuario especificado');
      }
    });
  }

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
