import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { InicioComponent } from './inicio/inicio.component';
import { RuletaComponent } from './Juegos/ruleta/ruleta.component';
import { ContactoComponent } from './contacto/contacto.component';
import { AvisoLegalComponent } from './aviso-legal/aviso-legal.component';
import { PoliticaPrivacidadComponent } from './politica-privacidad/politica-privacidad.component';
import { TerminosCondicionesComponent } from './terminos-condiciones/terminos-condiciones.component';
import { TragaperrasComponent } from './Juegos/tragaperras/tragaperras.component';
import { EleccionComponent } from './eleccion/eleccion.component';
@NgModule({
  declarations: [
    AppComponent,
    InicioComponent,
    RuletaComponent,
    ContactoComponent,
    AvisoLegalComponent,
    PoliticaPrivacidadComponent,
    TerminosCondicionesComponent,
    TragaperrasComponent,
    EleccionComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
