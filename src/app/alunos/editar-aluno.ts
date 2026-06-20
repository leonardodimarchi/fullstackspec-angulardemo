import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { StudentService } from '../services/student.service';

@Component({
    selector: 'app-editar-aluno',
    imports: [ReactiveFormsModule, RouterLink],
    template: `
    <section>
      <h1>Editar aluno</h1>

      @if (loadingAluno()) {
        <p>Carregando...</p>
      }

      @if (!loadingAluno()) {
        <form [formGroup]="form" (ngSubmit)="salvar()">
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

          <button type="submit" [disabled]="saving()">Salvar</button>
        </form>
      }

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