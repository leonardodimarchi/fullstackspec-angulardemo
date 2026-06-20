import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

export interface Student {
    _id: string;
    nome: string;
    idade: number;
    curso: string;
    notas?: number[];
}

export interface CreateStudentPayload {
    nome: string;
    idade: number;
    curso: string;
    notas: number[];
}

@Injectable({
    providedIn: 'root',
})
export class StudentService {
    private readonly http = inject(HttpClient);
    private readonly baseUrl = 'http://localhost:3000/students';

    listStudents(): Observable<Student[]> {
        return this.http.get<Student[]>(this.baseUrl);
    }

    getStudentById(id: string): Observable<Student> {
        return this.http.get<Student>(`${this.baseUrl}/${id}`);
    }

    createStudent(payload: CreateStudentPayload): Observable<Student> {
        return this.http.post<Student>(this.baseUrl, payload);
    }

    deleteStudent(id: string): Observable<{ message: string }> {
        return this.http.delete<{ message: string }>(`${this.baseUrl}/${id}`);
    }

    updateStudent(id: string, payload: CreateStudentPayload): Observable<Student> {
        return this.http.put<Student>(`${this.baseUrl}/${id}`, payload);
    }
}