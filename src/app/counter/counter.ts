import { Component, computed, signal } from '@angular/core';

@Component({
    selector: 'app-counter',
    template: `
    <div class="m-3">
      <h1 class="text-3xl font-bold mb-3">Contador</h1>
      <p class="text-lg">Este exemplo demonstra o data binding em funcionamento.</p>

      <p class="text-md">Valor atual: <strong>{{ contador() }}</strong></p>
      <p class="text-md">Dobro do valor: <strong>{{ dobro() }}</strong></p>

      <div class="flex gap-2 mt-3">
        <button class="btn btn-secondary" type="button" (click)="diminuir()">Diminuir</button>
        <button class="btn btn-primary" type="button" (click)="aumentar()">Aumentar</button>
        <button class="btn btn-danger" type="button" (click)="zerar()">Zerar</button>
      </div>
    </div>
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