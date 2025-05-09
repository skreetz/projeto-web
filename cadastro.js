// Aguarda o carregamento completo do DOM
document.addEventListener('DOMContentLoaded', function() {
  // Seleciona elementos do formulário
  const contatoForm = document.getElementById('contatoForm');
  const contatoId = document.getElementById('contato-id');
  const nomeInput = document.getElementById('nome');
  const telefoneInput = document.getElementById('telefone');
  const emailInput = document.getElementById('email');
  const formTitle = document.getElementById('form-title');
  const btnSalvar = document.getElementById('btn-salvar');
  const btnCancelar = document.getElementById('btn-cancelar');
  const errorContainer = document.getElementById('error-container');
  
  // Verifica se estamos em modo de edição (URL contém parâmetro id)
  const urlParams = new URLSearchParams(window.location.search);
  const editId = urlParams.get('id');
  
  // Se estiver em modo de edição, carrega os dados do contato para o formulário
  if (editId) {
    formTitle.textContent = 'Editar Contato';
    btnSalvar.textContent = 'Atualizar';
    
    // Recupera os contatos do localStorage
    const contatos = JSON.parse(localStorage.getItem('contatos')) || [];
    
    // Encontra o contato com o ID especificado
    const contato = contatos.find(c => c.id === parseInt(editId));
    
    // Se o contato for encontrado, preenche o formulário com seus dados
    if (contato) {
      contatoId.value = contato.id;
      nomeInput.value = contato.nome;
      telefoneInput.value = contato.telefone;
      emailInput.value = contato.email || '';
    } else {
      // Se o contato não for encontrado, redireciona para a página de listagem
      mostrarMensagemConfirmacao('Contato não encontrado!', 'danger');
      setTimeout(() => {
        window.location.href = 'index.html';
      }, 2000);
    }
  }
  
  // Função para mostrar mensagem de confirmação
  function mostrarMensagemConfirmacao(mensagem, tipo = 'success') {
    // Cria elemento toast
    const toastElement = document.createElement('div');
    toastElement.className = `toast align-items-center text-bg-${tipo} border-0`;
    toastElement.setAttribute('role', 'alert');
    toastElement.setAttribute('aria-live', 'assertive');
    toastElement.setAttribute('aria-atomic', 'true');
    
    // Conteúdo do toast
    const toastBody = document.createElement('div');
    toastBody.className = 'd-flex';
    
    // Div para o corpo do toast
    const flexDiv = document.createElement('div');
    flexDiv.className = 'toast-body';
    flexDiv.textContent = mensagem;
    
    // Botão para fechar o toast
    const closeButton = document.createElement('button');
    closeButton.type = 'button';
    closeButton.className = 'btn-close btn-close-white me-2 m-auto';
    closeButton.setAttribute('data-bs-dismiss', 'toast');
    closeButton.setAttribute('aria-label', 'Fechar');
    
    // Monta a estrutura do toast
    toastBody.appendChild(flexDiv);
    toastBody.appendChild(closeButton);
    toastElement.appendChild(toastBody);
    
    // Adiciona o toast ao container
    document.getElementById('toast-container').appendChild(toastElement);
    
    // Inicializa e exibe o toast usando Bootstrap
    const toast = new bootstrap.Toast(toastElement, {
      delay: 3000,
      autohide: true
    });
    toast.show();
    
    // Remove o toast do DOM após ocultar
    toastElement.addEventListener('hidden.bs.toast', function() {
      toastElement.remove();
    });
  }
  
  // Função para validar o formulário
  function validarFormulario() {
    // Limpa mensagens de erro anteriores
    errorContainer.innerHTML = '';
    errorContainer.classList.add('d-none');
    
    // Remove classes de erro de todos os campos
    nomeInput.classList.remove('is-invalid');
    telefoneInput.classList.remove('is-invalid');
    emailInput.classList.remove('is-invalid');
    
    // Array para armazenar mensagens de erro
    const errors = [];
    
    // Validação do nome
    if (nomeInput.value.trim() === '') {
      errors.push('O nome é obrigatório.');
      nomeInput.classList.add('is-invalid');
    } else if (nomeInput.value.trim().length < 3) {
      errors.push('O nome deve ter no mínimo 3 caracteres.');
      nomeInput.classList.add('is-invalid');
    }
    
    // Validação do telefone
    const telefoneRegex = /^(\d{10,11}|\(\d{2}\)\s?\d{4,5}-?\d{4})$/;
    if (telefoneInput.value.trim() === '') {
      errors.push('O telefone é obrigatório.');
      telefoneInput.classList.add('is-invalid');
    } else if (!telefoneRegex.test(telefoneInput.value.replace(/\D/g, ''))) {
      errors.push('O telefone deve ser um número válido (DDD + número).');
      telefoneInput.classList.add('is-invalid');
    }
    
    // Validação do email (se preenchido)
    if (emailInput.value.trim() !== '') {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(emailInput.value.trim())) {
        errors.push('O email informado não é válido.');
        emailInput.classList.add('is-invalid');
      }
    }
    
    // Se houver erros, exibe as mensagens
    if (errors.length > 0) {
      errorContainer.classList.remove('d-none');
      const errorList = document.createElement('ul');
      errorList.className = 'mb-0';
      errors.forEach(error => {
        const li = document.createElement('li');
        li.textContent = error;
        errorList.appendChild(li);
      });
      errorContainer.appendChild(errorList);
      return false;
    }
    
    return true;
  }
  
  // Adiciona formatação automática ao telefone enquanto o usuário digita
  telefoneInput.addEventListener('input', function(event) {
    let value = this.value.replace(/\D/g, '');
    let formattedValue = '';
    
    if (value.length > 0) {
      // Adiciona parênteses para o DDD
      if (value.length > 2) {
        formattedValue = '(' + value.substring(0, 2) + ') ' + value.substring(2);
      } else {
        formattedValue = '(' + value;
      }
      
      // Adiciona hífen para separar os últimos 4 dígitos
      if (value.length > 6) {
        const finalPart = formattedValue.substring(5);
        if (value.length > 10) {  // Celular (11 dígitos)
          formattedValue = formattedValue.substring(0, 5) + 
                          finalPart.substring(0, 5) + '-' + 
                          finalPart.substring(5);
        } else {  // Telefone fixo (10 dígitos)
          formattedValue = formattedValue.substring(0, 5) + 
                          finalPart.substring(0, 4) + '-' + 
                          finalPart.substring(4);
        }
      }
    }
    
    this.value = formattedValue;
  });
  
  // Adiciona um evento de escuta para o envio do formulário
  contatoForm.addEventListener('submit', function(event) {
    // Previne o comportamento padrão de submissão do formulário
    event.preventDefault();
    
    // Valida o formulário antes de prosseguir
    if (!validarFormulario()) {
      return;
    }
    
    // Recupera os contatos já existentes do localStorage
    const contatos = JSON.parse(localStorage.getItem('contatos')) || [];
    
    // Verifica se estamos em modo de edição ou criação
    if (contatoId.value) {
      // Modo de edição - atualiza o contato existente
      const index = contatos.findIndex(c => c.id === parseInt(contatoId.value));
      
      if (index !== -1) {
        // Atualiza os dados do contato existente
        contatos[index].nome = nomeInput.value;
        contatos[index].telefone = telefoneInput.value;
        contatos[index].email = emailInput.value;
        
        // Salva a lista atualizada no localStorage
        localStorage.setItem('contatos', JSON.stringify(contatos));
        
        // Mostra mensagem de confirmação
        mostrarMensagemConfirmacao('Contato atualizado com sucesso!');
        
        // Aguarda um pouco para que o usuário veja a mensagem antes de redirecionar
        setTimeout(function() {
          window.location.href = 'index.html';
        }, 2000);
      }
    } else {
      // Modo de criação - cria um novo contato
      const novoContato = {
        id: Date.now(), // Cria um ID único baseado no timestamp atual
        nome: nomeInput.value,
        telefone: telefoneInput.value,
        email: emailInput.value
      };
      
      // Adiciona o novo contato à lista
      contatos.push(novoContato);
      
      // Salva a lista atualizada no localStorage
      localStorage.setItem('contatos', JSON.stringify(contatos));
      
      // Mostra mensagem de confirmação
      mostrarMensagemConfirmacao('Contato adicionado com sucesso!');
      
      // Limpa o formulário para permitir novas entradas
      contatoForm.reset();
      nomeInput.classList.remove('is-valid');
      telefoneInput.classList.remove('is-valid');
      emailInput.classList.remove('is-valid');
    }
  });
  
  // Adiciona evento de clique ao botão Cancelar
  btnCancelar.addEventListener('click', function() {
    // Se estiver no modo de edição, redireciona para a página de listagem
    if (editId) {
      window.location.href = 'index.html';
    }
    // Se estiver no modo de criação, apenas limpa o formulário (comportamento padrão do reset)
    nomeInput.classList.remove('is-valid', 'is-invalid');
    telefoneInput.classList.remove('is-valid', 'is-invalid');
    emailInput.classList.remove('is-valid', 'is-invalid');
  });
  
  // Adiciona validação em tempo real para os campos
  nomeInput.addEventListener('blur', function() {
    if (this.value.trim() === '' || this.value.trim().length < 3) {
      this.classList.add('is-invalid');
      this.classList.remove('is-valid');
    } else {
      this.classList.remove('is-invalid');
      this.classList.add('is-valid');
    }
  });
  
  telefoneInput.addEventListener('blur', function() {
    const telefoneRegex = /^(\d{10,11}|\(\d{2}\)\s?\d{4,5}-?\d{4})$/;
    if (this.value.trim() === '' || !telefoneRegex.test(this.value.replace(/\D/g, ''))) {
      this.classList.add('is-invalid');
      this.classList.remove('is-valid');
    } else {
      this.classList.remove('is-invalid');
      this.classList.add('is-valid');
    }
  });
  
  emailInput.addEventListener('blur', function() {
    if (this.value.trim() !== '') {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(this.value.trim())) {
        this.classList.add('is-invalid');
        this.classList.remove('is-valid');
      } else {
        this.classList.remove('is-invalid');
        this.classList.add('is-valid');
      }
    } else {
      this.classList.remove('is-invalid');
      this.classList.remove('is-valid');
    }
  });
});