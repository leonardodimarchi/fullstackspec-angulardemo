import { Routes } from '@angular/router';
import { About } from './about/about';
import { Home } from './home/home';
import { Login } from './login/login';

export const routes: Routes = [
    {
        path: '',
        pathMatch: 'full',
        component: Home
    },
    {
        path: 'alunos',
        loadComponent: () => import('./alunos/alunos').then((m) => m.Alunos)
    },
    {
        path: 'alunos/criar',
        loadComponent: () => import('./alunos/criar-aluno').then((m) => m.CriarAluno)
    },
    {
        path: 'alunos/:id/editar',
        loadComponent: () => import('./alunos/editar-aluno').then((m) => m.EditarAluno)
    },
    {
        path: 'login', component: Login
    },
    {
        path: 'about', component: About
    },
    {
        path: 'contador',
        loadComponent: () => import('./counter/counter').then((m) => m.Counter)
    }
];
