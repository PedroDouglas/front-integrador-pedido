import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Component({
  selector: 'app-produto',
  templateUrl: './produto.component.html',
  styleUrl: './produto.component.css'
})
export class ProdutoComponent {
  produtos: any[] = [];
  quantidadeAdicionar: number = 0;
  quantidadeRemover: number = 0;
  produtoSelecionado: number = 0;
  novoProduto: any = {}; 
  errorMessage: string = '';
  constructor(private http: HttpClient) { }

  ngOnInit(): void {
    this.listarProdutos();
  }

  cadastrarProduto() {
    this.http.post<any>('http://localhost:8080/api/produtos', this.novoProduto)
      .pipe(
        catchError(this.handleError.bind(this))
      )
      .subscribe(() => {
        this.novoProduto = {};
        this.listarProdutos(); 
      });
  }

  listarProdutos() {
    this.http.get<any[]>('http://localhost:8080/api/produtos')
      .pipe(
        catchError(this.handleError.bind(this))
      )
      .subscribe(response => {
        this.produtos = response;
      });
  }

  adicionarQuantidade(id: number, quantidade: number) {
    this.http.put(`http://localhost:8080/api/produtos/${id}/adicionar-quantidade?quantidadeAdicionar=${quantidade}`, {})
      .pipe(
        catchError(this.handleError.bind(this))
      )
      .subscribe(() => {
        this.listarProdutos();
      });
  }

  removerQuantidade(id: number, quantidade: number) {
    this.http.put(`http://localhost:8080/api/produtos/${id}/remover-quantidade?quantidadeRemover=${quantidade}`, {})
      .pipe(
        catchError(this.handleError.bind(this))
      )
      .subscribe(() => {
        this.listarProdutos();
      });
  }

  excluirProduto(id: number) {
    this.http.delete(`http://localhost:8080/api/produtos/${id}`)
      .pipe(
        catchError(this.handleError.bind(this))
      )
      .subscribe(() => {
        this.listarProdutos();
      });
  }

  private handleError(error: HttpErrorResponse) {
    this.errorMessage = error.error.message || 'Erro ao processar a requisição.';
    alert(this.errorMessage); // Exibe alerta com a mensagem de erro

    // Fecha o alerta após 5 segundos
    setTimeout(() => {
      this.errorMessage = '';
    }, 5000);

    return throwError(this.errorMessage);
  }
}