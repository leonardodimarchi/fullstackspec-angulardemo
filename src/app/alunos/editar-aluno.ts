import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { StudentService } from '../services/student.service';

@Component({
    selector: 'app-editar-aluno',
    imports: [ReactiveFormsModule, RouterLink],
    template: `
    <div class="m-3">
      <h1 class="text-3xl font-bold mb-3">Editar aluno</h1>

      @if (loadingAluno()) {
        <span class="loading loading-dots loading-xl"></span>
      }

      @if (!loadingAluno()) {
        <form [formGroup]="form" (ngSubmit)="salvar()">
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
                <button type="submit" [disabled]="saving()" class="btn btn-primary">Salvar</button>
            </div>
        </form>
      }
    </div>
  `,
})
export class EditarAluno {
    private readonly fb = inject(FormBuilder);
    private readonly route = inject(ActivatedRoute);
    private readonly router = inject(Router);
    private readonly studentService = inject(StudentService);

    protected readonly loadingAluno = signal(true);
    protected readonly saving = signal(false);
    protected readonly error = signal('');
    protected readonly success = signal('');

    protected readonly form = this.fb.group({
        nome: ['', [Validators.required]],
        idade: [null as number | null, [Validators.required, Validators.min(0)]],
        curso: ['', [Validators.required]],
        notas: ['', [Validators.required]],
    });

    private readonly studentId = this.route.snapshot.paramMap.get('id') ?? '';

    constructor() {
        if (!this.studentId) {
            this.error.set('Aluno inválido.');
            this.loadingAluno.set(false);
            return;
        }

        this.studentService.getStudentById(this.studentId).subscribe({
            next: (student) => {
                this.form.setValue({
                    nome: student.nome,
                    idade: student.idade,
                    curso: student.curso,
                    notas: (student.notas ?? []).join(', '),
                });
            },
            error: () => {
                this.error.set('Falha ao carregar aluno.');
            },
            complete: () => {
                this.loadingAluno.set(false);
            },
        });
    }

    protected salvar(): void {
        if (!this.studentId) {
            this.error.set('Aluno inválido.');
            return;
        }

        if (this.form.invalid) {
            this.form.markAllAsTouched();
            this.error.set('Preencha todos os campos.');
            return;
        }

        this.saving.set(true);
        this.error.set('');

        const notas = (this.form.controls.notas.value ?? '')
            .split(',')
            .map((item) => Number(item.trim()))
            .filter((nota) => !Number.isNaN(nota));

        this.studentService.updateStudent(this.studentId, {
            nome: this.form.controls.nome.value ?? '',
            idade: this.form.controls.idade.value ?? 0,
            curso: this.form.controls.curso.value ?? '',
            notas,
        }).subscribe({
            next: () => {
                this.success.set('Aluno atualizado com sucesso, retornando para a listagem...');

                setTimeout(() => {
                    this.router.navigateByUrl('/alunos');
                }, 2000);
            },
            error: () => {
                this.error.set('Falha ao salvar aluno.');
                this.saving.set(false);
            },
        });
    }
}