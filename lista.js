// Aguarda o carregamento completo do DOM
document.addEventListener('DOMContentLoaded', function() {
  // Função para carregar e exibir os contatos
  function carregarContatos() {
    // Recupera os contatos do localStorage
    const contatos = JSON.parse(localStorage.getItem('contatos')) || [];
    
    // Seleciona o elemento tbody da tabela
    const listaContatos = document.getElementById('lista-contatos');
    // Seleciona o elemento de aviso "sem contatos"
    const semContatos = document.getElementById('sem-contatos');
    
    // Limpa o conteúdo atual da tabela
    listaContatos.innerHTML = '';
    
    // Verifica se existem contatos para exibir
    if (contatos.length === 0) {
      // Se não houver contatos, mostra a mensagem
      semContatos.style.display = 'block';
    } else {
      // Se houver contatos, esconde a mensagem
      semContatos.style.display = 'none';
      
      // Percorre a lista de contatos e adiciona cada um à tabela
      contatos.forEach(function(contato) {
        const row = document.createElement('tr');
        
        row.innerHTML = `
          <td>${contato.nome}</td>
          <td>${contato.telefone}</td>
          <td>${contato.email}</td>
          <td>
            <button class="btn btn-sm btn-primary editar me-1" data-id="${contato.id}">Editar</button>
            <button class="btn btn-sm btn-danger excluir" data-id="${contato.id}">Excluir</button>
          </td>
        `;
        
        listaContatos.appendChild(row);
      });
      
      // Adiciona evento de clique aos botões de excluir
      document.querySelectorAll('.excluir').forEach(function(button) {
        button.addEventListener('click', function() {
          const id = parseInt(this.getAttribute('data-id'));
          excluirContato(id);
        });
      });
      
      // Adiciona evento de clique aos botões de editar
      document.querySelectorAll('.editar').forEach(function(button) {
        button.addEventListener('click', function() {
          const id = parseInt(this.getAttribute('data-id'));
          editarContato(id);
        });
      });
    }
  }
  
  // Função para excluir um contato
  function excluirContato(id) {
    // Confirmação antes de excluir
    if (confirm('Tem certeza que deseja excluir este contato?')) {
      // Recupera os contatos do localStorage
      const contatos = JSON.parse(localStorage.getItem('contatos')) || [];
      
      // Filtra a lista para remover o contato com o ID especificado
      const novaLista = contatos.filter(contato => contato.id !== id);
      
      // Salva a nova lista no localStorage
      localStorage.setItem('contatos', JSON.stringify(novaLista));
      
      // Recarrega a lista de contatos
      carregarContatos();
    }
  }
  
  // Função para editar um contato
  function editarContato(id) {
    // Redireciona para a página de cadastro com o ID do contato a ser editado
    window.location.href = `cadastro.html?id=${id}`;
  }
  
  // Carrega os contatos quando a página é aberta
  carregarContatos();
});