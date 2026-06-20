import { Component, computed, signal } from '@angular/core';

@Component({
    selector: 'app-counter',
    template: `
    <section>
      <h1>Contador</h1>
      <p>Este exemplo demonstra o data binding em funcionamento.</p>

      <p>Valor atual: <strong>{{ contador() }}</strong></p>
      <p>Dobro do valor: <strong>{{ dobro() }}</strong></p>

      <div>
        <button type="button" (click)="diminuir()">Diminuir</button>
        <button type="button" (click)="aumentar()">Aumentar</button>
        <button type="button" (click)="zerar()">Zerar</button>
      </div>
    </section>
  `,
})
export class Counter {
    protected readonly contador = signal(0);
    protected readonly dobro = computed(() => this.contador() * 2);

    protected aumentar(): void {
        this.contador.update((valor) => valor + 1);
    }

    protected diminuir(): void {
        this.contador.update((valor) => valor - 1);
    }

    protected zerar(): void {
        this.contador.set(0);
    }
}