import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-contacto',
  templateUrl: './contacto.component.html',
  styleUrls: ['./contacto.component.scss']
})
export class ContactoComponent implements OnInit {
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
