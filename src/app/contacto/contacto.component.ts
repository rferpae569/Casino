import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ServicioService } from '../servicio.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';  // Agregar estas importaciones
import { Contacto } from '../model/contacto';  // Asegúrate de que el modelo Contacto esté importado

@Component({
  selector: 'app-contacto',
  templateUrl: './contacto.component.html',
  styleUrls: ['./contacto.component.scss']
})
export class ContactoComponent implements OnInit {
  usuario: string | null = null;
  correo: string = '';
  razon: string = '';
  telefono: string = '';
  mensaje: string = '';
  dropdownVisible: boolean = false;
  mensajeExito: string | null = null;
  mensajeError: string | null = null;

  // Agregar esta línea para usar un FormGroup en lugar de las variables individuales
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
      this.usuario = parsedData.usuario;
    } else {
      this.router.navigateByUrl('');
    }

    // Inicializamos el FormGroup
    this.formularioContacto = new FormGroup({
      correo: new FormControl('', [Validators.required, Validators.email]),
      razon: new FormControl('', [Validators.required]),
      telefono: new FormControl('', [Validators.required]),
      mensaje: new FormControl('', [Validators.required])
    });
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
  
    // Obtener el IdUsuario del sessionStorage (si existe)
    const IdUsuario = this.usuario ? parseInt(this.usuario) : null;
  
    // Crear el objeto Contacto
    const data: Contacto = {
      id: 0,  // Este id será autogenerado por la base de datos
      IdUsuario: IdUsuario,  // Id del usuario que lo realiza
      CorreoUsuario: this.formularioContacto.value.correo,  // Correo del usuario que realiza el contacto
      Razon: this.formularioContacto.value.razon,
      Telefono: this.formularioContacto.value.telefono,
      Mensaje: this.formularioContacto.value.mensaje
    };
  
    // Agregar un console.log para verificar los datos que se están enviando
    console.log('Enviando datos:', data);
  
    // Enviar los datos al backend
    this.servicioService.insertarContacto(data).subscribe(
      response => {
        console.log('Respuesta del backend:', response); // Verifica la respuesta
        if (response.msg) {
          this.mensajeExito = response.msg;
          this.mensajeError = null;
          this.formularioContacto.reset();
          this.router.navigate(['/Eleccion']);
        }
      },
      error => {
        console.log('Error al enviar mensaje:', error); // Verifica el error
        this.mensajeError = 'Hubo un error al enviar el mensaje. Intente nuevamente.';
        this.mensajeExito = null;
      }
    );
  }
  
}


