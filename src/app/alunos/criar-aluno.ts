import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { StudentService } from '../services/student.service';

@Component({
    selector: 'app-criar-aluno',
    imports: [ReactiveFormsModule, RouterLink],
    template: `
    <div class="m-3">

      <h1 class="text-3xl font-bold mb-3">Criar aluno</h1>

      <form [formGroup]="form" (ngSubmit)="criar()">

        <fieldset class="fieldset">
            <legend class="fieldset-legend">Nome</legend>
            <input type="text" class="input" placeholder="Seu nome" formControlName="nome" />
        </fieldset>

        <fieldset class="fieldset">
            <legend class="fieldset-legend">Idade</legend>
            <input type="number" class="input" placeholder="Sua idade" formControlName="idade" />
        </fieldset>

        <fieldset class="fieldset">
            <legend class="fieldset-legend">Curso</legend>
            <input type="text" class="input" placeholder="Seu curso" formControlName="curso" />
        </fieldset>

        <fieldset class="fieldset">
            <legend class="fieldset-legend">Notas (separadas por vírgula)</legend>
            <input type="text" class="input" placeholder="Ex: 7,5,8,9" formControlName="notas" />
        </fieldset>

        @if (error()) {
            <p class="text-red-500">{{ error() }}</p>
        }

        @if (success()) {
            <p class="text-green-500">{{ success() }}</p>
        }

        <div class="flex gap-2 mt-4">
            <button routerLink="/alunos" class="btn btn-secondary mb-6">Voltar para lista</button>
            <button type="submit" [disabled]="loading()" class="btn btn-primary">Criar</button>
        </div>
      </form>
    </div>
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