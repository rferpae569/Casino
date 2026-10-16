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

  constructor(private router: Router) {}
  ngOnInit(): void {
    this.actualizarUsuario();
    this.actualizarRuta();
    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe(() => {
        this.actualizarRuta();
        this.actualizarUsuario();
        this.dropdownVisible = false;
      });
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
    this.router.navigateByUrl('');
  }
}
