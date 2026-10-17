import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
  usuario: string | null = null;
  dropdownVisible: boolean = false;
  rutaActual: string = '';

  // Control del menú hamburguesa
  mobileMenuOpen: boolean = false;

  constructor(private router: Router) {}

  ngOnInit(): void {
    this.actualizarUsuario();
    this.actualizarRuta();

    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe(() => {
        this.actualizarRuta();
        this.actualizarUsuario();

        // Cerramos los menús al cambiar de página
        this.dropdownVisible = false;
        this.mobileMenuOpen = false;
      });
  }

  // Determina si debe mostrarse la hamburguesa
  get mostrarHamburguesa(): boolean {
    const ruta = this.rutaActual.toLowerCase();

    // En Inicio y Registro solo hay un enlace
    if (ruta === '/' || ruta === '' || ruta === '/registro') {
      return false;
    }

    return true;
  }

  // Abre o cierra el menú hamburguesa
  toggleMobileMenu(): void {
    this.mobileMenuOpen = !this.mobileMenuOpen;
  }

  actualizarUsuario(): void {
    const sessionData = localStorage.getItem('session');

    if (sessionData) {
      try {
        const parsedData = JSON.parse(sessionData);
        this.usuario = parsedData.usuario ?? null;
      } catch {
        this.usuario = null;
      }
    } else {
      this.usuario = null;
    }
  }

  actualizarRuta(): void {
    this.rutaActual = this.router.url.split('?')[0].split('#')[0];
  }

  toggleDropdown(): void {
    this.dropdownVisible = !this.dropdownVisible;
  }

  logout(): void {
    localStorage.removeItem('session');
    this.usuario = null;
    this.dropdownVisible = false;
    this.mobileMenuOpen = false;

    this.router.navigateByUrl('');
  }
}
