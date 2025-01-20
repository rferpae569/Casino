import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl, ValidationErrors } from '@angular/forms'; // Importar correctamente
import { Usuarios } from '../model/usuarios';
import { Router } from '@angular/router';
import { ServicioService } from '../servicio.service';

@Component({
  selector: 'app-borrar',
  templateUrl: './borrar.component.html',
  styleUrls: ['./borrar.component.scss']
})
export class BorrarComponent implements OnInit {

  usuario: string | null = null;
  dropdownVisible: boolean = false;
  borrarForm: FormGroup; // Formulario reactivo
  mensajeExito: string = '';
  mensajeError: string = '';

  constructor(private router: Router, private fb: FormBuilder, private servicioService: ServicioService) {
     // Crear el formulario reactivo
     this.borrarForm = this.fb.group({
      usuario: ['', [Validators.required]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      fechaNacimiento: ['', [Validators.required]],
      correo: ['', [Validators.required, Validators.email]],
    });
  }

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

  // Método para enviar el formulario
enviarFormulario() {
  console.log('Solicitud para borrar usuario enviada.');

  if (this.borrarForm.valid) {
    console.log('Formulario válido. Datos del formulario:', this.borrarForm.value);

    // Construir el objeto del tipo Usuarios
    const usuarioABorrar: Usuarios = {
      Usuario: this.borrarForm.value.usuario,
      Passwrd: this.borrarForm.value.password,
      FechaNacimiento: this.borrarForm.value.fechaNacimiento,
    };

    const correoABorrar = this.borrarForm.value.correo; // Obtener el correo del formulario

    // Llamar al servicio para borrar el usuario
    this.servicioService.BorrarUsuario(usuarioABorrar, correoABorrar).subscribe({
      next: (respuesta) => {
        console.log('Respuesta exitosa del servidor:', respuesta);
        this.mensajeExito = 'Usuario eliminado exitosamente.';
        
        // Eliminar la sesión
        localStorage.removeItem('session');

        // Redirigir al inicio
        this.router.navigateByUrl('');

        // Resetear el formulario
        this.borrarForm.reset();
      },
      error: (error) => {
        console.error('Error en la solicitud al servidor:', error);
        this.mensajeError = 'Hubo un error al eliminar al usuario.';
      },
    });
  } else {
    console.log('Formulario inválido:', this.borrarForm.errors);
    this.mensajeError = 'Por favor, complete todos los campos correctamente.';
  }
}
}
