import { Component } from '@angular/core';
import {FormBuilder, FormGroup, Validators, AbstractControl, ValidationErrors,} from '@angular/forms';
import { Usuarios } from '../model/usuarios';
import { ServicioService } from '../servicio.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-registro',
  templateUrl: './registro.component.html',
  styleUrls: ['./registro.component.scss'],
})
export class RegistroComponent {
  registroForm: FormGroup; // Formulario reactivo
  mensajeExito: string = '';
  mensajeError: string = '';

  constructor(
    private fb: FormBuilder,
    private servicioService: ServicioService,
    private router: Router
  ) {
    // Crear el formulario reactivo con validaciones
    this.registroForm = this.fb.group({
      usuario: ['', [Validators.required]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      fechaNacimiento: ['', [Validators.required, this.edadMayorDe18]],
      correo: ['', [Validators.required, Validators.email]],
      mayorEdad: [false, [Validators.requiredTrue]],
      aceptarPoliticas: [false, [Validators.requiredTrue]],
    });
  }

  // Función de validación personalizada de edad
  edadMayorDe18(control: AbstractControl): ValidationErrors | null {
    const fechaNacimiento = control.value;

    if (!fechaNacimiento) {
      return null; // Si no hay fecha, no aplicamos la validación
    }

    const fechaActual = new Date();
    const fechaNacimientoDate = new Date(fechaNacimiento);
    let edad = fechaActual.getFullYear() - fechaNacimientoDate.getFullYear(); // Cambiar const a let para poder modificar la variable
    const mes = fechaActual.getMonth() - fechaNacimientoDate.getMonth();

    // Ajustar si no ha cumplido años este año
    if (
      mes < 0 ||
      (mes === 0 && fechaActual.getDate() < fechaNacimientoDate.getDate())
    ) {
      edad--;
    }

    if (edad >= 18) {
      return null; // Edad válida
    } else {
      return { edadInvalida: true }; // Edad no válida
    }
  }

  // Método para enviar el formulario
  enviarFormulario() {
    console.log('Formulario enviado.');

    if (this.registroForm.valid) {
      console.log(
        'Formulario válido. Datos del formulario:',
        this.registroForm.value
      );

      const nuevoUsuario: Usuarios = {
        Id: 0, // No se envía, el servidor lo genera automáticamente
        Usuario: this.registroForm.value.usuario,
        Passwrd: this.registroForm.value.password,
        FechaNacimiento: this.registroForm.value.fechaNacimiento,
      };

      const correo = this.registroForm.value.correo;

      // Llamar al servicio para insertar el usuario
      this.servicioService.InsertarUsuario(nuevoUsuario, correo).subscribe({
        next: (respuesta) => {
          console.log('Respuesta exitosa del servidor:', respuesta);
          this.mensajeExito = 'Usuario registrado exitosamente.';
          this.registroForm.reset();
          this.router.navigate(['']);
        },
        error: (error) => {
          console.error('Error en la solicitud al servidor:', error);
          this.mensajeError = 'Hubo un error al registrar al usuario.';
        },
      });
    } else {
      console.log('Formulario inválido:', this.registroForm.errors);
      this.mensajeError = 'Por favor, complete todos los campos correctamente.';
    }
  }
}
