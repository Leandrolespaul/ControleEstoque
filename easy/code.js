let itensEstocaveis = []


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
    observers = []

    constructor(nome) {
        this.nome = nome
        this.id = criarId()
    }

    adicionarItem(item, quantidade) {
        if (quantidade < 0) throw Error('Quantidade não pode ser negativa')
        const itemEstoque = this.itens.find(itemEst => itemEst.item === item)
        if (itemEstoque) {
            itemEstoque.quantidade += quantidade
            this.observers.forEach(func => func())
            return item
        }
        this.itens.push({
            item,
            quantidade
        })
        this.observers.forEach(func => func())
        return item
    }

    removerQuantidadeItem(item, quantidade) {
        if (quantidade < 0) throw Error('Quantidade Removida tem que ser maior que 0')
        const itemEstoque = this.itens.find(itemEst => itemEst.item === item)
        if (itemEstoque) {
            itemEstoque.quantidade -= quantidade
            this.observers.forEach(func => func())
            return item
        }

    }

    removerItemDeposito(item) {
        this.itens = this.itens.filter(itemEst => itemEst.item !== item)
        this.observers.forEach(func => func())
        return item
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

    reposicaoItem() {
        return this.itens.filter(item => item.quantidade <= 10)
    }
}


const deposito = new Deposito('Restaurante')


const removerItemEstoque = (item) => {
    itensEstocaveis = itensEstocaveis.filter(itemEst => itemEst !== item)
    return item

}

function alterarPonto(preco) {
    preco = parseFloat(preco).toFixed(2)
    return `R$${preco.replace(".", ',')}`
}


const onFormCreateItemSubmit = (e) => {
    e.preventDefault()
    const descricao = document.getElementById('nome-item').value
    const unidadeMedida = document.getElementById('unidade-medida-item').value
    const preco = document.getElementById('preco-item').value
    document.getElementById('form-item').reset()

    // Testar se tem algum valor vazio nos inputs de criação de itens. Se sim, não fazer nada, retornar
    if (!descricao.trim() || !unidadeMedida.trim() || !preco) return

    const renderizarItensEstocaveis = () => {
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
        tdPreco.innerHTML = alterarPonto(preco)

        const tagItem = document.getElementById('itens-estocaveis-select')
        tagItem.innerHTML = ''
        tagItem.appendChild(document.createElement('option'))
        itensEstocaveis.forEach(item => {
            const optionItem = document.createElement('option')
            optionItem.label = `${item.descricao} - ${item.unidadeMedida}`
            optionItem.value = item.id
            optionItem.id = item.id
            tagItem.add(optionItem)
        })

    }
    renderizarItensEstocaveis()
}

const renderizarItensEstoque = () => {
    const tabelaInterfaceItemQuantidade = document.getElementById('tabela-itens-dep')
    const cabecalhoItensDep = document.getElementById('cabecalho-itens-dep')

    tabelaInterfaceItemQuantidade.innerHTML = ''
    tabelaInterfaceItemQuantidade.appendChild(cabecalhoItensDep)

    deposito.itens.forEach(itemDep => { //pegamos os itens dos depositos
        const trItem = document.createElement('tr')
        const tdDescricaoItem = document.createElement('td')
        const tdUnidadeMedidaItem = document.createElement('td')
        const tdPrecoItem = document.createElement('td')
        const tdQuantidadeItem = document.createElement('td')


        trItem.appendChild(tdDescricaoItem)
        trItem.appendChild(tdUnidadeMedidaItem)
        trItem.appendChild(tdPrecoItem)
        trItem.appendChild(tdQuantidadeItem)

        tabelaInterfaceItemQuantidade.appendChild(trItem)
        tdDescricaoItem.innerHTML = itemDep.item.descricao
        tdUnidadeMedidaItem.innerHTML = itemDep.item.unidadeMedida
        tdPrecoItem.innerHTML = alterarPonto(itemDep.item.preco)
        tdQuantidadeItem.innerHTML = itemDep.quantidade
    })


    const tagValorTotal = document.getElementById('valor-total')
    tagValorTotal.innerHTML = ''
    const item = deposito.getValorTotal()
    const tagLiValorTotal = document.createElement('li')
    tagLiValorTotal.appendChild(document.createTextNode(`Valor total dos itens, ${alterarPonto(item)}`))
    tagValorTotal.appendChild(tagLiValorTotal)



    const tagReposicao = document.getElementById('reposicao')
    tagReposicao.innerHTML = ''
    const itemRepor = deposito.reposicaoItem()
    itemRepor.forEach(item => {
        const tagLiReposicao = document.createElement('li')
        tagLiReposicao.appendChild(document.createTextNode(`Item que precisa repor: ${item.item.descricao} | ${item.item.unidadeMedida} | ${item.quantidade} quantidade(s)`))
        tagReposicao.appendChild(tagLiReposicao)
    })

}

deposito.observers.push(renderizarItensEstoque)

const onFormAddItemToDep = (e) => {
    e.preventDefault()
    const dropdowItemSelecao = document.getElementById('itens-estocaveis-select')
    const inputQuantidade = document.getElementById('quantidade-item')

    const idItemSelecao = Number(dropdowItemSelecao.value)
    const dropDownSelecao = itensEstocaveis.find(item => item.id === idItemSelecao)
    if (!dropDownSelecao) return
    deposito.adicionarItem(dropDownSelecao, Number(inputQuantidade.value))

    document.getElementById('form-add-items-dep').reset()
}
const btnRemoverQuantidadeItem = document.getElementById('remover-item-dep-btn')
btnRemoverQuantidadeItem.addEventListener('click', (e) => {
    e.preventDefault()
    const dropdowItemSelecao = document.getElementById('itens-estocaveis-select')
    const inputQuantidade = document.getElementById('quantidade-item')

    const idItemSelecao = Number(dropdowItemSelecao.value)
    const dropDownSelecao = itensEstocaveis.find(item => item.id === idItemSelecao)
    if (dropDownSelecao) {
        deposito.removerQuantidadeItem(dropDownSelecao, inputQuantidade.value)
        document.getElementById('form-add-items-dep').reset()
    }
})

const btnRemoverItem = document.getElementById('remover-item-deposito')
btnRemoverItem.addEventListener('click', (e) => {
    e.preventDefault()

    const dropdowItemSelecao = document.getElementById('itens-estocaveis-select')
    
    const idItemSelecao = Number(dropdowItemSelecao.value)
    const dropDownSelecao = itensEstocaveis.find(item => item.id === idItemSelecao)
    if (dropDownSelecao) {
        const dialog = confirm("Deseja Excluir o item?");
        
        if (dialog) {
            deposito.removerItemDeposito(dropDownSelecao)
            
            
        }
        document.getElementById('form-item').reset()
    }
})


const btnRemoverItemCadastrado = document.getElementById('remover-item-cadastrado')
btnRemoverItemCadastrado.addEventListener('click', (e) => {
    e.preventDefault()
    const dropdowItemSelecao = document.getElementById('itens-estocaveis-select')
    const idItemSelecao = Number(dropdowItemSelecao.value)
    const dropDownSelecao = itensEstocaveis.find(item => item.id === idItemSelecao)
    if (dropDownSelecao) {
        removerItemEstoque(dropDownSelecao)
        console.log(itensEstocaveis)
        document.getElementById('form-item').reset()
    }
   
    
})


document.getElementById('adicionar-item-dep-btn')
    .addEventListener('click', onFormAddItemToDep)

document.getElementById('criar-item-btn', 'remover-item-cadastro')
    .addEventListener('click', onFormCreateItemSubmit)

