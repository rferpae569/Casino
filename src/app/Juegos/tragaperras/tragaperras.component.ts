import { Component } from '@angular/core';

@Component({
  selector: 'app-tragaperras',
  templateUrl: './tragaperras.component.html',
  styleUrls: ['./tragaperras.component.scss'],
})
export class TragaperrasComponent {
  slots: string[] = ['🍒', '🍋', '🍊'];
  displayedSlots: string[] = ['?', '?', '?'];
  credits: number = 100; // Créditos iniciales
  isSpinning: boolean = false; // Indica si la máquina está girando
  currentBet: number = 0; // Apuesta actual
  rewardCredits: number = 0; // Créditos ganados en el último giro

  private slotSymbols: string[] = [
    '🍒',
    '🍋',
    '🍊',
    '🍇',
    '🍉',
    '⭐',
    '💰',
    '7️⃣',
  ];
  private rewards: { [key: string]: number } = {
    '🍒🍒🍒': 10,
    '🍋🍋🍋': 20,
    '🍊🍊🍊': 30,
    '🍇🍇🍇': 40,
    '🍉🍉🍉': 50,
    '⭐⭐⭐': 100,
    '💰💰💰': 200,
    '7️⃣7️⃣7️⃣': 500,
  };

  spinSlots(bet: number): void {
    if (this.isSpinning || this.credits < bet) return;

    this.currentBet = bet; // Actualiza la apuesta actual
    this.rewardCredits = 0; // Reinicia la recompensa del último giro
    this.credits -= bet; // Descuenta la apuesta de los créditos
    this.isSpinning = true; // Marcaa que está girando
    this.displayedSlots = ['?', '?', '?']; // Restablece los símbolos mostrados

    let animationSteps = 0;

    const spinInterval = setInterval(() => {
      this.displayedSlots = [
        this.getRandomSymbol(),
        this.getRandomSymbol(),
        this.getRandomSymbol(),
      ];

      animationSteps++;

      if (animationSteps > 10) {
        clearInterval(spinInterval);

        // Detiene la animación y muestra los resultados finales
        this.slots = [
          this.getRandomSymbol(),
          this.getRandomSymbol(),
          this.getRandomSymbol(),
        ];
        this.displayedSlots = [...this.slots];
        this.isSpinning = false;

        // Verifica si se ha ganado algo
        const combination = this.slots.join('');
        if (this.rewards[combination]) {
          const reward = this.rewards[combination] * bet;
          this.rewardCredits = reward; // Actualizamos los créditos ganados
          this.credits += reward; // Agregamos la recompensa a los créditos totales
        }
      }
    }, 100); // Cambia los símbolos cada 100ms
  }

  private getRandomSymbol(): string {
    return this.slotSymbols[
      Math.floor(Math.random() * this.slotSymbols.length)
    ];
  }
}
