import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { HttpHeaders } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { Usuarios } from './model/usuarios';
import { Correo } from './model/correo';
//importamos los modulos

@Injectable({
  providedIn: 'root',
})
export class ServicioService {
  //Creamos la ruta y las funciones para necesarios para dirigirnos a los archivos especificados

  url: string = 'http://localhost/servercasino/';

  constructor(private http: HttpClient) {}

  getDatosUsuarios(): Observable<Usuarios[]> {
    //Esta funcion sirve para leer los usuarios que devuelve el archivo php de la base de datos
    return this.http.get<Usuarios[]>(`${this.url}usuarios/leerusuario.php`);
  }

  getDatosCorreo(): Observable<Correo[]> {
    //Esta funcion sirve para leer los usuarios que devuelve el archivo php de la base de datos
    return this.http.get<Correo[]>(`${this.url}correos/leercorreo.php`);
  }

  login(user: Usuarios): Observable<Usuarios[]> {
    //Esta funcion sirve para comprobar que el usuario esta en la base de datos cuando vayamos a iniciar sesion
    return this.http.post<Usuarios[]>(
      `${this.url}usuarios/loginusuario.php`,
      user
    );
  }

  //Esta funcion sirve para insertar la usuario en la base de datos.
  InsertarUsuario(nuevo: Usuarios, correo: string): Observable<any> {
    const payload = {
      Usuario: nuevo.Usuario,
      Passwrd: nuevo.Passwrd,
      FechaNacimiento: nuevo.FechaNacimiento,
      Correo: correo,
    };

    return this.http.post<any>(
      `${this.url}usuarios/insertarusuario.php`,
      payload,
      {
        headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
      }
    );
  }
}
