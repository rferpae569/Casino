import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-eleccion',
  templateUrl: './eleccion.component.html',
  styleUrls: ['./eleccion.component.scss'],
})
export class EleccionComponent implements OnInit {
  usuario: string | null = null;
  dropdownVisible: boolean = false;

  constructor(private router: Router) {}

  ngOnInit() {
    const sessionData = localStorage.getItem('session');
    if (sessionData) {
      const parsedData = JSON.parse(sessionData);
      this.usuario = parsedData.usuario;
    } else {
      this.router.navigateByUrl('');
    }
  }

  // Función para alternar la visibilidad del menú desplegable
  toggleDropdown() {
    this.dropdownVisible = !this.dropdownVisible;
  }

  //Funcion para cerrar sesion
  logout() {
    localStorage.removeItem('session');
    this.router.navigateByUrl('');
  }
}
