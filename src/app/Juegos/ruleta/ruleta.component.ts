import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-ruleta',
  templateUrl: './ruleta.component.html',
  styleUrls: ['./ruleta.component.scss']
})
export class RuletaComponent implements OnInit  {

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

  //Funcion para cerrar sesion
  logout() {
    localStorage.removeItem('session');
    this.router.navigateByUrl('');
  }
  
  segments = [
    '0', '32', '15', '19', '4', '21', '2', '25', '17', '34', '6', '27', '13', '36', 
    '11', '30', '8', '23', '10', '5', '24', '16', '33', '1', '20', '14', '31', '9', 
    '22', '18', '29', '7', '28', '12', '35', '3', '26'
  ];

colors = {
    red: ['1', '3', '5', '7', '9', '12', '14', '16', '18', '19', '21', '23', '25', '27', '30', '32', '34', '36'],
    black: ['2', '4', '6', '8', '10', '11', '13', '15', '17', '20', '22', '24', '26', '28', '29', '31', '33', '35']
  };

rotation = ''; // Almacena el estilo de rotación de la ruleta
result: string | null = null; // Almacena el resultado del giro
message: string = ''; // Mensaje que se mostrará abajo del resultado
isSpinComplete = false; // Controla si la animación de la ruleta terminó
credits = 100; // Créditos iniciales del jugador
bets: { [key: string]: (string | number)[] | string | null } = {
    number: [],
    color: null,
    parity: null,
    range: null,
};

// Método para girar la ruleta
spin() {
  // Verificar si hay créditos disponibles
  const totalBets =
      (Array.isArray(this.bets['number']) ? this.bets['number'].length : 0) +
      (this.bets['color'] ? 1 : 0) +
      (this.bets['parity'] ? 1 : 0) +
      (this.bets['range'] ? 1 : 0);

  if (this.credits < totalBets) {
      this.message = 'No tienes suficientes créditos para cubrir todas las apuestas.';
      return;
  }

  // Restar créditos según las apuestas
  this.credits -= totalBets;

  const spins = Math.floor(Math.random() * 3) + 3; // Vueltas completas adicionales
  const randomAngle = Math.floor(Math.random() * 360); // Ángulo aleatorio final
  const totalRotation = spins * 360 + randomAngle;

  // Determinar el segmento ganador basado en la rotación
  const winningSegmentIndex = Math.floor((360 - (totalRotation % 360)) / (360 / this.segments.length)) % this.segments.length;
  this.result = this.segments[winningSegmentIndex];

  // Iniciar la rotación
  this.rotation = `rotate(${totalRotation}deg)`;

  // Reiniciar el mensaje y ocultar el resultado temporalmente
  this.message = '';
  this.isSpinComplete = false;

  // Verificar las apuestas después de la animación
  setTimeout(() => this.checkBets(), 3000); // Tiempo que dura la animación (en milisegundos)
  setTimeout(() => this.showResult(), 3000); // Después de la animación, mostrar el resultado
}

// Método para colocar las apuestas
placeBet(type: string, value: string | number) {
    if (this.credits <= 0) {
        this.message = 'No tienes suficientes créditos para apostar.';
        return;
    }

    if (type === 'number') {
        if (Array.isArray(this.bets['number'])) {
            if (this.bets['number'].includes(value)) {
                // Si el número ya está en la apuesta, lo eliminamos
                this.bets['number'] = this.bets['number'].filter(v => v !== value);
            } else {
                // Si no, lo agregamos al arreglo
                this.bets['number'] = [...this.bets['number'], value];
            }
        }
    } else if (type === 'color' || type === 'parity' || type === 'range') {
        if (this.bets[type] === value) {
            this.bets[type] = null;
        } else {
            this.bets[type] = value as string; // Forzamos el tipo a 'string' si es 'color', 'parity' o 'range'
        }
    }
}

// Verifica las apuestas y muestra el resultado
checkBets() {
    if (!this.result) return; // Asegurarnos de que result no sea null

    const color = this.colors.red.includes(this.result) ? 'red' : this.colors.black.includes(this.result) ? 'black' : null;
    const parity = parseInt(this.result) % 2 === 0 ? 'even' : 'odd';
    const isInFirst12 = parseInt(this.result) >= 1 && parseInt(this.result) <= 12;
    const isInSecond12 = parseInt(this.result) >= 13 && parseInt(this.result) <= 24;
    const isInThird12 = parseInt(this.result) >= 25 && parseInt(this.result) <= 36;

    let payout = 0;

    if (this.bets['number'] && Array.isArray(this.bets['number']) && this.bets['number'].includes(this.result)) {
        payout = 36; // Pago 35:1, se multiplica la apuesta por 36
        this.message = '¡Ganaste apostando al número!';
    } else if (this.bets['color'] === color) {
        payout = 2; // Pago 1:1
        this.message = '¡Ganaste apostando al color!';
    } else if (this.bets['parity'] === parity) {
        payout = 2; // Pago 1:1
        this.message = '¡Ganaste apostando a pares/impares!';
    } else if (this.bets['range'] === 'first12' && isInFirst12) {
        payout = 2; // Pago 1:1
        this.message = '¡Ganaste apostando a 0 - 12!';
    } else if (this.bets['range'] === 'second12' && isInSecond12) {
        payout = 2; // Pago 1:1
        this.message = '¡Ganaste apostando a 13 - 24!';
    } else if (this.bets['range'] === 'third12' && isInThird12) {
        payout = 2; // Pago 1:1
        this.message = '¡Ganaste apostando a 25 - 36!';
    } else {
        this.message = 'No hubo ganancias.';
    }

    // Agregar ganancias a los créditos
    this.credits += payout;
}

isBetSelected(type: string, value: string | number): boolean {
  if (type === 'number') {
    return Array.isArray(this.bets['number']) && this.bets['number'].includes(value);
  }
  return this.bets[type] === value;
}


// Muestra el resultado después de la animación
showResult() {
    this.isSpinComplete = true; // Marca que la animación terminó y se debe mostrar el resultado
}

// Calcula la rotación para cada segmento
getSegmentRotation(index: number): string {
    const angle = (index * 360) / this.segments.length;
    return `rotate(${angle}deg) translateY(-50%)`;
}

}




