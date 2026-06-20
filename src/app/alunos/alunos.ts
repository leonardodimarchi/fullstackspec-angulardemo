import { Component, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Student, StudentService } from '../services/student.service';

@Component({
    selector: 'app-alunos',
    imports: [RouterLink],
    template: `
    <div class="m-3">
      <h1 class="text-3xl font-bold mb-3">Alunos</h1>

      <div class="flex gap-2 mb-3">
        <button class="btn" routerLink="/alunos/criar">Criar novo aluno</button>
        <button class="btn" (click)="recarregar()">Recarregar</button>
      </div>
      

      @if (loading()) {
        <span class="loading loading-dots loading-xl"></span>
      }

      @if (error()) {
        <p class="text-red-500">{{ error() }}</p>
      }

      @if (!loading() && students().length === 0) {
        <p class="text-gray-500">Nenhum aluno encontrado.</p>
      }

      @if (!loading() && students().length > 0) {
        <ul class="list bg-base-100 rounded-box shadow-md">
            <li class="p-4 pb-2 text-xs opacity-60 tracking-wide">Alunos cadastrados</li>
  
            @for (student of students(); track student._id) {
                <li class="list-row">
                    <div class="list-col-grow">
                        <div>{{ student.nome }} ({{ student.idade }} anos)</div>
                        <div class="text-xs uppercase font-semibold opacity-60">{{ student.curso }}</div>
                    </div>
            
                    <button class="btn btn-primary" [routerLink]="['/alunos', student._id, 'editar']">
                        Editar
                    </button>
                    <button class="btn btn-error" type="button" (click)="excluir(student._id)">
                        Excluir
                    </button>
                </li>
            }
        </ul>
      }
    </div>
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