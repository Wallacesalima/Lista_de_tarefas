const inputTarefa = document.querySelector('.input-tarefa') // Seleciona o input de texto
const btnTarefa = document.querySelector('.btn-tarefa') // Seleciona o botão de adicionar tarefa
const tarefas = document.querySelector('.tarefas') // Seleciona o container onde as tarefas serão adicionadas

function criarLi() {
    const li = document.createElement('li') // Cria um elemento <li>
    return li
}

function criarTarefa(textInput) {
    const li = criarLi() // Cria o <li>
    tarefas.appendChild(li) // Adiciona o <li> dentro da lista de tarefas
    li.innerHTML = textInput // Coloca o texto da tarefa dentro do <li>
    limpaInput() // Limpa o campo de texto
    criaBotaoEditar(li) // Cria o botão de editar
    criaBotaoApagar(li) // Cria o botão de apagar
    salvarTarefas() // Salva as tarefas no localStorage
}

function limpaInput() {
    inputTarefa.value = '' // Limpa o valor do input
    inputTarefa.focus() // Dá foco no input novamente
}

function criaBotaoApagar(li) {
    li.innerHTML += '  ' // Adiciona espaço entre o texto e o botão
    const botaoApagar = document.createElement('button') // Cria botão
    botaoApagar.innerHTML = '❌' // Ícone do botão
    botaoApagar.setAttribute('class', 'apagar') // Classe para identificar
    botaoApagar.setAttribute('title', 'Apagar essa tarefa') // Tooltip do botão
    li.appendChild(botaoApagar) // Adiciona o botão no <li>
}

function criaBotaoEditar(li) {
    li.innerHTML += '  ' // Espaço entre texto e botão
    const botaoEditar = document.createElement('button') // Cria botão
    botaoEditar.innerHTML = '✏️' // Ícone do botão
    botaoEditar.setAttribute('class', 'editar'); // Classe para identificar
    botaoEditar.setAttribute('title', 'Editar tarefa'); // Tooltip do botão
    li.appendChild(botaoEditar); // Adiciona o botão no <li>
}

function apagarTarefa() {
    document.addEventListener('click', function (e) { // Escuta cliques no documento
        const el = e.target // Elemento clicado

        if (el.classList.contains('apagar')) { // Verifica se clicou no botão de apagar
            el.parentElement.remove() // Remove o <li> (tarefa)
            salvarTarefas() // Atualiza o localStorage
        }
    })
}

function editarTarefa() {
    document.addEventListener('click', function (e) { // Escuta cliques no documento
        const el = e.target

        if (el.classList.contains('editar')) { // Verifica se clicou no botão de editar
            const li = el.parentElement // Seleciona o <li> da tarefa
            const textoAtual = li.firstChild.textContent.trim() // Pega o texto atual

            // Criar input para edição
            const inputEdit = document.createElement('input')
            inputEdit.type = 'text'
            inputEdit.value = textoAtual
            inputEdit.classList.add('input-editar')

            // Substituir texto pelo input
            li.firstChild.remove()
            li.insertBefore(inputEdit, li.firstChild)
            inputEdit.focus()

            // Quando pressionar Enter ou clicar fora
            inputEdit.addEventListener('blur', () => {
                finalizarEdicao(inputEdit, li)
            })

            inputEdit.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    inputEdit.blur()
                }
            })
        }
    })
}

function finalizarEdicao(input, li) {
    const novoTexto = input.value.trim() // Pega o novo texto

    if (novoTexto !== '') { // Verifica se não está vazio
        input.remove() // Remove o input de edição
        const textoNode = document.createTextNode(novoTexto + '  ') // Cria um novo texto
        li.insertBefore(textoNode, li.firstChild) // Insere o novo texto
        salvarTarefas() // Atualiza localStorage
    } else {
        alert('O texto não pode ser vazio.') // Alerta se estiver vazio
        input.focus() // Retorna o foco pro input
    }
}

function salvarTarefas() {
    const liTarefas = tarefas.querySelectorAll('li') // Seleciona todas as tarefas
    const listaDeTarefas = [] // Lista para armazenar os textos

    for (let tarefa of liTarefas) {
        let tarefaTexto = tarefa.innerText // Pega o texto da tarefa
        tarefaTexto = tarefaTexto.replace('❌', '').trim() // Remove ícone de apagar
        tarefaTexto = tarefaTexto.replace('✏️', '').trim() // Remove ícone de editar
        listaDeTarefas.push(tarefaTexto) // Adiciona na lista
    }

    const tarefasJSON = JSON.stringify(listaDeTarefas) // Converte para JSON
    localStorage.setItem('tarefas', tarefasJSON) // Salva no localStorage
}

function addTarefaSalvas() {
    const tarefas = localStorage.getItem('tarefas') // Pega do localStorage
    const listaDeTarefas = JSON.parse(tarefas) || [] // Converte para array ou array vazio

    for (let tarefa of listaDeTarefas) {
        criarTarefa(tarefa) // Recria cada tarefa na tela
    }
}

btnTarefa.addEventListener('click', function (e) {
    // Adiciona tarefa ao clicar no botão, se não estiver vazia
    inputTarefa.value === '' ? alert('digite uma tarefa') : criarTarefa(inputTarefa.value); limpaInput()
})

inputTarefa.addEventListener('keypress', function (e) {
    if (e.keyCode === 13) {
        // Adiciona tarefa ao pressionar Enter, se não estiver vazia
        inputTarefa.value === '' ? alert('digite uma tarefa') : criarTarefa(inputTarefa.value), limpaInput()
    }
})

addTarefaSalvas() // Adiciona tarefas salvas na tela ao carregar
editarTarefa() // Ativa a funcionalidade de editar
apagarTarefa() // Ativa a funcionalidade de apagar
