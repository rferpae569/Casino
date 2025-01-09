import { Component} from '@angular/core';

@Component({
  selector: 'app-ruleta',
  templateUrl: './ruleta.component.html',
  styleUrls: ['./ruleta.component.scss']
})
export class RuletaComponent  {
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
  bets: { [key: string]: (string | number)[] | string | null } = {
    number: [], // Arreglo para números apostados
    color: null,
    parity: null,
    range: null,
  };

  // Método para girar la ruleta
  spin() {
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

  // Verifica si una apuesta está seleccionada
  isBetSelected(type: string, value: string | number): boolean {
    if (type === 'number') {
      return Array.isArray(this.bets['number']) && this.bets['number'].includes(value);
    }
    return this.bets[type] === value;
  }

  // Verifica las apuestas y muestra el resultado
  checkBets() {
    if (!this.result) return; // Asegurarnos de que result no sea null
  
    const color = this.colors.red.includes(this.result) ? 'red' : this.colors.black.includes(this.result) ? 'black' : null;
    const parity = parseInt(this.result) % 2 === 0 ? 'even' : 'odd';
    const isInFirst12 = parseInt(this.result) >= 1 && parseInt(this.result) <= 12;
    const isInSecond12 = parseInt(this.result) >= 13 && parseInt(this.result) <= 24;
    const isInThird12 = parseInt(this.result) >= 25 && parseInt(this.result) <= 36;
  
    // Verificar si el resultado está en los números apostados
    if (this.bets['number'] && Array.isArray(this.bets['number']) && this.bets['number'].includes(this.result)) {
      this.message = '¡Ganaste apostando al número!';
    } else if (this.bets['color'] === color) {
      this.message = '¡Ganaste apostando al color!';
    } else if (this.bets['parity'] === parity) {
      this.message = '¡Ganaste apostando a pares/impares!';
    } else if (this.bets['range'] === 'first12' && isInFirst12) {
      this.message = '¡Ganaste apostando a 0 - 12!';
    } else if (this.bets['range'] === 'second12' && isInSecond12) {
      this.message = '¡Ganaste apostando a 13 - 24!';
    } else if (this.bets['range'] === 'third12' && isInThird12) {
      this.message = '¡Ganaste apostando a 25 - 36!';
    } else {
      this.message = 'No hubo ganancias.';
    }
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




