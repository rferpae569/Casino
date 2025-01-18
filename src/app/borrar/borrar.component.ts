import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ServicioService } from '../servicio.service';
import { Usuarios } from '../model/usuarios';

@Component({
  selector: 'app-borrar',
  templateUrl: './borrar.component.html',
  styleUrls: ['./borrar.component.scss']
})
export class BorrarComponent implements OnInit {

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

  logout() {
    localStorage.removeItem('session');
    this.router.navigateByUrl('');
  }

}
