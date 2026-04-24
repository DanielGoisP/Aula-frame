import { Component, signal } from '@angular/core';
import { Tarefa } from "./tarefa";
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-root',
  templateUrl: './app.html',
  standalone: false,
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('TODOapp');

  arrayDeTarefas = signal<Tarefa[]>([]); 
  apiURL: string;

  constructor(private http: HttpClient) {
    this.apiURL = 'http://localhost:3000';
    this.READ_tarefas();
  }

  CREATE_tarefa(descricaoNovaTarefa: string) {
    if (!descricaoNovaTarefa.trim()) return; // Evita criar tarefa vazia
    var novaTarefa = new Tarefa(descricaoNovaTarefa, false);
    this.http.post<Tarefa>(`${this.apiURL}/api/post`, novaTarefa).subscribe(
      resultado => { 
        console.log('Criado:', resultado); 
        this.READ_tarefas(); 
      });
  }

  // Função que estava faltando e causando o erro no HTML
  UPDATE_tarefa(tarefaAserModificada: Tarefa) {
    this.http.patch<Tarefa>(`${this.apiURL}/api/update/${tarefaAserModificada._id}`, tarefaAserModificada).subscribe(
      resultado => {
        console.log('Atualizado:', resultado);
        this.READ_tarefas();
      }
    );
  }

  DELETE_tarefa(tarefaAserRemovida: Tarefa) {
    var id = tarefaAserRemovida._id; // Mais direto que usar o indexOf
    this.http.delete<Tarefa>(`${this.apiURL}/api/delete/${id}`).subscribe(
      resultado => { 
        console.log('Removido:', resultado); 
        this.READ_tarefas(); 
      });
  }

  READ_tarefas() {
    this.http.get<Tarefa[]>(`${this.apiURL}/api/getAll`).subscribe(
      resultado => this.arrayDeTarefas.set(resultado)
    );
  }
}