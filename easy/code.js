let proximoId = 1
const criarId = () => {
    return proximoId++
}

class ItemEstoque {
    constructor(descricao, unidadeMedida, preco) {
        this.descricao = descricao
        this.unidadeMedida = unidadeMedida
        this.preco = preco
        this.id = criarId()
    }
}

class Deposito {

    itens = []

    constructor(nome) {
        this.nome = nome
        this.id = criarId()
    }

    adicionarItem(item, quantidade) {
        if (quantidade < 0) throw Error('Quantidade não pode ser negativa')
        const itemEstoque = this.itens.find(itemEst => itemEst.item === item)
        if (itemEstoque) {
            itemEstoque.quantidade += quantidade

            return item
        }
        this.itens.push({
            item,
            quantidade
        })

        return item
    }

    removerItem(item, quantidade) {
        if (quantidade < 0) throw Error('Quantidade Removida tem que ser maior que 0')
        const itemEstoque = this.itens.find(itemEst => itemEst.item === item)
        if (itemEstoque) {
            itemEstoque.quantidade -= quantidade
            return item
        }

    }

    getValorTotal() {
        return this.itens.reduce((ac, itemEst) => ac + (itemEst.quantidade * itemEst.item.preco), 0)

    }

    quantidadeTotalItem(item) {
        const itemEstoque = this.itens.find(itemEst => itemEst.item === item)
        if (itemEstoque) {
            return itemEstoque.quantidade
        }
        return 0
    }

    reposicaoItem(item) {
        return this.itens.filter(item => {
            if (item.quantidade <= 10) return item.item
        })
    }
}


const deposito = new Deposito('Restaurante')

// Simulação de tabela de itens estocáveis no banco de dados
const itensEstocaveis = []


const onFormCreateItemSubmit = (e) => {
    e.preventDefault()
    const descricao = document.getElementById('nome-item').value
    const unidadeMedida = document.getElementById('unidade-medida-item').value
    const preco = document.getElementById('preco-item').value
    document.getElementById('form-item').reset()

    // Testar se tem algum valor vazio nos inputs de criação de itens. Se sim, não fazer nada, retornar
    if (!descricao.trim() || !unidadeMedida.trim() || !preco) return

    const itemEstoque = new ItemEstoque(descricao, unidadeMedida, preco)
    itensEstocaveis.push(itemEstoque)

    const tabelaItensInterface = document.getElementById('tabela-itens')
    const tr = document.createElement('tr')
    const tdDescricao = document.createElement('td')
    const tdUnidadeMedida = document.createElement('td')
    const tdPreco = document.createElement('td')

    tr.appendChild(tdDescricao)
    tr.appendChild(tdUnidadeMedida)
    tr.appendChild(tdPreco)

    tabelaItensInterface.appendChild(tr)

    tdDescricao.innerHTML = descricao
    tdUnidadeMedida.innerHTML = unidadeMedida
    tdPreco.innerHTML = preco
}

document.getElementById('criar-item-btn')
    .addEventListener('click', onFormCreateItemSubmit)






















































// const listaItem = document.getElementById('lista-itens')
// const itemListado = document.createElement('li')
// itemListado.appendChild(document.createTextNode(item.nome))
// listaItem.appendChild(itemListado)