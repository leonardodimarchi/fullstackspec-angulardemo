import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { StudentService } from '../services/student.service';

@Component({
    selector: 'app-criar-aluno',
    imports: [ReactiveFormsModule, RouterLink],
    template: `
    <section>
      <h1>Criar aluno</h1>

      <form [formGroup]="form" (ngSubmit)="criar()">
        <div>
          <label for="nome">Nome</label>
          <input id="nome" type="text" formControlName="nome" />
        </div>

        <div>
          <label for="idade">Idade</label>
          <input id="idade" type="number" formControlName="idade" />
        </div>

        <div>
          <label for="curso">Curso</label>
          <input id="curso" type="text" formControlName="curso" />
        </div>

        <div>
          <label for="notas">Notas (separadas por vírgula)</label>
          <input id="notas" type="text" formControlName="notas" />
        </div>

        <button type="submit" [disabled]="loading()">Criar</button>
      </form>

      @if (error()) {
        <p>{{ error() }}</p>
      }

      @if (success()) {
        <p>{{ success() }}</p>
      }

      <button routerLink="/alunos">Voltar para lista</button>
    </section>
  `,
})
export class CriarAluno {
    private readonly fb = inject(FormBuilder);
    private readonly studentService = inject(StudentService);
    private readonly router = inject(Router);

    protected readonly loading = signal(false);
    protected readonly error = signal('');
    protected readonly success = signal('');

    protected readonly form = this.fb.group({
        nome: ['', [Validators.required]],
        idade: [null as number | null, [Validators.required, Validators.min(0)]],
        curso: ['', [Validators.required]],
        notas: ['', [Validators.required]],
    });

    protected criar(): void {
        if (this.form.invalid) {
            this.form.markAllAsTouched();
            this.error.set('Preencha todos os campos.');
            this.success.set('');
            return;
        }

        this.loading.set(true);
        this.error.set('');
        this.success.set('');

        const valorNotas = this.form.controls.notas.value ?? '';
        const notas = valorNotas
            .split(',')
            .map((item) => Number(item.trim()))
            .filter((nota) => !Number.isNaN(nota));

        this.studentService.createStudent({
            nome: this.form.controls.nome.value ?? '',
            idade: this.form.controls.idade.value ?? 0,
            curso: this.form.controls.curso.value ?? '',
            notas,
        }).subscribe({
            next: () => {
                this.success.set('Aluno criado com sucesso, retornando para a listagem...');
                this.form.reset();

                setTimeout(() => {
                    this.router.navigateByUrl('/alunos');
                }, 2000);
            },
            error: () => {
                this.error.set('Falha ao criar aluno.');
                this.loading.set(false);
            },
        });
    }
}