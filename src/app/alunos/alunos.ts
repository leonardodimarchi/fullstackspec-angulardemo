import { Component, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Student, StudentService } from '../services/student.service';

@Component({
    selector: 'app-alunos',
    imports: [RouterLink],
    template: `
    <section>
      <h1>Alunos</h1>
      <button routerLink="/alunos/criar">Criar novo aluno</button>
      <button type="button" (click)="recarregar()">Recarregar</button>

      @if (loading()) {
        <p>Carregando...</p>
      }

      @if (error()) {
        <p>{{ error() }}</p>
      }

      @if (!loading() && students().length === 0) {
        <p>Nenhum aluno encontrado.</p>
      }

      @if (!loading() && students().length > 0) {
        <ul>
          @for (student of students(); track student._id) {
            <li>
              <strong>{{ student.nome }}</strong> - {{ student.idade }} anos - {{ student.curso }}
              <button [routerLink]="['/alunos', student._id, 'editar']">Editar</button>
              <button type="button" (click)="excluir(student._id)">Excluir</button>
            </li>
          }
        </ul>
      }
    </section>
  `,
})
export class Alunos {
    private readonly studentService = inject(StudentService);

    protected readonly students = signal<Student[]>([]);
    protected readonly loading = signal(true);
    protected readonly error = signal('');

    constructor() {
        this.loadStudents();
    }

    protected recarregar(): void {
        this.loadStudents();
    }

    protected excluir(id: string): void {
        this.studentService.deleteStudent(id).subscribe({
            next: () => {
                this.students.update((items) => items.filter((student) => student._id !== id));
            },
            error: () => {
                this.error.set('Falha ao excluir aluno.');
            },
        });
    }

    private loadStudents(): void {
        this.loading.set(true);
        this.error.set('');

        this.studentService.listStudents().subscribe({
            next: (items) => {
                this.students.set(items);
            },
            error: () => {
                this.error.set('Falha ao carregar alunos.');
            },
            complete: () => {
                this.loading.set(false);
            },
        });
    }
}