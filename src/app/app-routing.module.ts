import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { InicioComponent } from './inicio/inicio.component';
import { RegistroComponent } from './registro/registro.component';
import { ActualizarComponent } from './actualizar/actualizar.component';
import { BorrarComponent } from './borrar/borrar.component';
import { RuletaComponent } from './Juegos/ruleta/ruleta.component';
import { TragaperrasComponent } from './Juegos/tragaperras/tragaperras.component';
import { EleccionComponent } from './eleccion/eleccion.component';
import { ContactoComponent } from './contacto/contacto.component';
import { AvisoLegalComponent } from './aviso-legal/aviso-legal.component';
import { PoliticaPrivacidadComponent } from './politica-privacidad/politica-privacidad.component';
import { TerminosCondicionesComponent } from './terminos-condiciones/terminos-condiciones.component';

const routes: Routes = [
  { path: '', component: InicioComponent },
  { path: 'Actualizar', component:ActualizarComponent},
  { path: 'Registro', component:RegistroComponent},
  { path: 'Borrar', component:BorrarComponent},
  { path: 'Eleccion',component:EleccionComponent},
  { path: 'Contacto', component: ContactoComponent},
  { path: 'Ruleta', component:RuletaComponent},
  { path: 'Tragaperras', component:TragaperrasComponent},
  { path: 'AvisoLegal', component:AvisoLegalComponent},
  { path: 'PoliticaPrivacidad', component:PoliticaPrivacidadComponent},
  { path: 'TerminosCondiciones', component:TerminosCondicionesComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
