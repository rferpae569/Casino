import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-terminos-condiciones',
  templateUrl: './terminos-condiciones.component.html',
  styleUrls: ['./terminos-condiciones.component.scss'],
})
export class TerminosCondicionesComponent implements OnInit {
  usuario: string | null = null;
  dropdownVisible: boolean = false;

  constructor(private router: Router) {}

  ngOnInit() {
    const sessionData = localStorage.getItem('session');
    if (sessionData) {
      const parsedData = JSON.parse(sessionData);
      this.usuario = parsedData.usuario;
    }
  }

  // Función para alternar la visibilidad del menú desplegable
  toggleDropdown() {
    this.dropdownVisible = !this.dropdownVisible;
  }

  logout() {
    localStorage.removeItem('session');
    this.router.navigateByUrl('');
  }
}
