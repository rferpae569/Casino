import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { HttpHeaders } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { Usuarios } from './model/usuarios';
import { Correo } from './model/correo';

@Injectable({
  providedIn: 'root',
})
export class ServicioService {
  url: string = 'http://localhost/servercasino/';

  constructor(private http: HttpClient) {}

  getDatosUsuarios(): Observable<Usuarios[]> {
    return this.http.get<Usuarios[]>(`${this.url}usuarios/leerusuario.php`);
  }

  getDatosCorreo(): Observable<Correo[]> {
    return this.http.get<Correo[]>(`${this.url}correos/leercorreo.php`);
  }

  login(user: Usuarios): Observable<Usuarios[]> {
    return this.http.post<Usuarios[]>(
      `${this.url}usuarios/loginusuario.php`,
      user
    );
  }

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

  BorrarUsuario(nuevo: Usuarios, correo: string): Observable<any> {
    const payload = {
      Usuario: nuevo.Usuario,
      Passwrd: nuevo.Passwrd,
      FechaNacimiento: nuevo.FechaNacimiento,
      Correo: correo,
    };

    return this.http.post<any>(
      `${this.url}usuarios/borrarusuario.php`,
      payload,
      {
        headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
      }
    );
  }

  actualizarUsuario(datos: Usuarios): Observable<any> {
    return this.http.post<any>(`${this.url}usuarios/actualizarusuario.php`, datos, {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
    });
  }
}
