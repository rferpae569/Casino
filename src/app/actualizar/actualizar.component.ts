import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ServicioService } from '../servicio.service';
import { Usuarios } from '../model/usuarios';

@Component({
  selector: 'app-actualizar',
  templateUrl: './actualizar.component.html',
  styleUrls: ['./actualizar.component.scss'],
})
export class ActualizarComponent implements OnInit {
  actualizarForm: FormGroup;
  usuario: string | null = null;
  dropdownVisible: boolean = false;

  constructor(
    private fb: FormBuilder,
    private servicioService: ServicioService,
    private router: Router
  ) {
    this.actualizarForm = this.fb.group({
      Usuario: ['', Validators.required],
      Passwrd: ['', Validators.required],
      Correo: ['', [Validators.required, Validators.email]],
    });
  }

  ngOnInit() {
    const sessionData = localStorage.getItem('session');
    if (sessionData) {
      const parsedData = JSON.parse(sessionData);
      this.usuario = parsedData.usuario;
  
      // Inicializa el valor del campo 'Usuario' con el valor de la sesión
      this.actualizarForm.patchValue({
        Usuario: this.usuario  // Asignamos el nombre de usuario a la propiedad 'Usuario' en el formulario
      });
    } else {
      this.router.navigateByUrl('');
    }
  }
  

  toggleDropdown() {
    this.dropdownVisible = !this.dropdownVisible;
  }

  //Funcion para cerrar sesion
  logout() {
    localStorage.removeItem('session');
    this.router.navigateByUrl('');
  }

  //Funcion para mandar los datos al servidor
  actualizarUsuario() {
    if (this.actualizarForm.valid) {
      this.servicioService.actualizarUsuario(this.actualizarForm.value).subscribe(
        (response) => {
          console.log('Usuario actualizado', response);
          alert('Datos actualizados correctamente');
          this.router.navigate(['/Eleccion']);
        },
        (error) => {
          console.error('Error al actualizar usuario', error);
          alert('Hubo un error al actualizar los datos');
        }
      );
    }
  }
}
