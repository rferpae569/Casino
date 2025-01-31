import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ServicioService } from '../servicio.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';  // Importar estas librerías
import { Contacto } from '../model/contacto';  // Asegúrate de que el modelo Contacto esté importado

@Component({
  selector: 'app-contacto',
  templateUrl: './contacto.component.html',
  styleUrls: ['./contacto.component.scss']
})
export class ContactoComponent implements OnInit {
  usuario: string | null = null;  // El nombre de usuario obtenido desde el sessionStorage
  correo: string = '';
  razon: string = '';
  telefono: string = '';
  mensaje: string = '';
  dropdownVisible: boolean = false;
  mensajeExito: string | null = null;
  mensajeError: string | null = null;

  // Usar FormGroup para el formulario
  formularioContacto: FormGroup = new FormGroup({
    correo: new FormControl('', [Validators.required, Validators.email]),
    razon: new FormControl('', [Validators.required]),
    telefono: new FormControl('', [Validators.required]),
    mensaje: new FormControl('', [Validators.required])
  });

  constructor(private router: Router, private servicioService: ServicioService) {}

  ngOnInit() {
    const sessionData = localStorage.getItem('session');
    if (sessionData) {
      const parsedData = JSON.parse(sessionData);
      this.usuario = parsedData.usuario;  // Almacenamos el nombre de usuario en `usuario`
    } else {
      this.router.navigateByUrl('');
    }
  }

  // Función para alternar la visibilidad del menú desplegable
  toggleDropdown() {
    this.dropdownVisible = !this.dropdownVisible;
  }

  // Función para hacer logout
  logout() {
    localStorage.removeItem('session');
    this.router.navigateByUrl('');
  }

  // Función para enviar el formulario de contacto
  enviarFormulario() {
    if (this.formularioContacto.invalid) {
      this.mensajeError = 'Todos los campos son obligatorios.';
      return;
    }

    // Verificar si el nombre de usuario existe
    const usuario = this.usuario;
    if (!usuario) {
      this.mensajeError = 'No se encontró el usuario.';
      return;
    }

    // Crear el objeto Contacto para enviar al backend
    const data: Contacto = {
      id: 0,  // El id será autogenerado en la base de datos
      NombreUsuario: usuario,  // Enviamos el nombre de usuario al backend
      CorreoUsuario: this.formularioContacto.value.correo,  // El correo del usuario
      Razon: this.formularioContacto.value.razon,  // Razón del contacto
      Telefono: this.formularioContacto.value.telefono,  // El teléfono
      Mensaje: this.formularioContacto.value.mensaje  // El mensaje del usuario
    };

    console.log('Enviando datos:', data);

    // Enviar los datos al backend
    this.servicioService.insertarContacto(data).subscribe(
      response => {
        console.log('Respuesta del backend:', response);  // Verificamos la respuesta
        if (response.msg) {
          this.mensajeExito = response.msg;
          this.mensajeError = null;
          this.formularioContacto.reset();
          this.router.navigate(['/Eleccion']);
        }
      },
      error => {
        console.log('Error al enviar mensaje:', error);  // Verificamos el error
        this.mensajeError = 'Hubo un error al enviar el mensaje. Intente nuevamente.';
        this.mensajeExito = null;
      }
    );
}

}




