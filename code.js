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

class Estoque {
    depositos = []
    observers = []

    constructor(nome, rua, bairro, numero) {
        this.nome = nome
        this.rua = rua
        this.bairro = bairro
        this.numero = numero
        this.id = criarId()
    }
    // oi
    addObserver(func) {
        this.observers.push(func)
    }

    removeObserver(func) {
        this.observers = this.observers.filter(funOb => funOb !== func)
    }

    notifyAll() {
        this.observers.forEach(fun => fun(this.depositos))
    }

    criarDeposito(nome) {
        const novoDeposito = new Deposito(nome)
        this.depositos.push(novoDeposito)
        this.notifyAll()
        return novoDeposito
    }

    removerDeposito(deposito) {
        // const indice = this.depositos.indexOf(deposito)
        // if (indice !== -1) // So remove o item se o deposito for encontrado
        //     this.depositos.splice(indice, 1)
        // return this.depositos

        this.depositos = this.depositos.filter(depositoEst => depositoEst !== deposito)
        this.notifyAll()
        return this.depositos
    }

    getValorTotal() {
        return this.depositos.reduce((ac, depositoEst) => ac + depositoEst.getValorTotal(), 0)
    }

    quantidadeTotalDeposito(item) {
        return this.depositos.reduce((ac, depositoEst) => ac + depositoEst.quantidadeTotalItem(item), 0)
    }

    //  Estoque [deposito, deposito...] -> deposito -> itens
    quantidadeTotalporDeposito(item) {
        return this.depositos.map(depositoEst => {
            return {
                deposito: depositoEst.nome,
                item: item.descricao,
                unidadeMedida: item.unidadeMedida,
                quantidade: depositoEst.quantidadeTotalItem(item)
            }
        })
    }
}

const tabelaEsotqueObservers = [
    () => {


        renderizarEstoqueLista()
        renderizarEstoqueOption('select-estoque-remover')
        renderizarEstoqueOption('select')
    }
]

let tabelaEstoque = []
const notifyObservers = () => {
    tabelaEsotqueObservers.forEach(ob => ob())
}
const adicionarEstoqueNaLista = (estoque) => {
    tabelaEstoque.push(estoque)
    notifyObservers()
}

const removerEstoquePorId = (id) => {
    tabelaEstoque = tabelaEstoque.filter(estoque => estoque.id !== id)
    notifyObservers()
}

const btnCriarDeposito = document.getElementById('btn-criar-deposito')
const nomeDeposito = document.getElementById('nome-deposito')
const btnCriarEstoque = document.getElementById('btn-criarEstoque')
const nome = document.getElementById('nome')
const rua = document.getElementById('rua')
const bairro = document.getElementById('bairro')
const numero = document.getElementById('numero')


const keyPressEvent = e => {
    if (e.key !== 'Enter') return
    if (!bairro.value || !numero.value || !nome.value || !rua.value || !nomeDeposito.value) return


    btnCriarEstoque.click()
    nome.focus()
}

nomeDeposito.addEventListener('keypress', keyPressEvent)
bairro.addEventListener('keypress', keyPressEvent)
numero.addEventListener('keypress', keyPressEvent)
nome.addEventListener('keypress', keyPressEvent)
rua.addEventListener('keypress', keyPressEvent)

const resetFormEstoque = () => {
    nome.value = ''
    rua.value = ''
    bairro.value = ''
    numero.value = ''


}

const renderizarEstoqueLista = () => {
    const listaEstoques = document.getElementById('lista-estoques')
    listaEstoques.innerHTML = ''
    tabelaEstoque.forEach(estoque => {
        const estoqueItemLista = document.createElement('li')
        estoqueItemLista.setAttribute('id', `estoque_${estoque.id}`)
        estoqueItemLista.appendChild(document.createTextNode(estoque.nome + ' ' + estoque.rua + ' ' +
            estoque.bairro + ' ' + estoque.numero))
        listaEstoques.appendChild(estoqueItemLista)
    })
}

const renderizarEstoqueOption = (id) => {
    const select = document.getElementById(id)
    select.innerHTML = ''
    select.appendChild(document.createElement('option'))
    tabelaEstoque.forEach(estoque => {
        const option = document.createElement('option')
        option.label = estoque.nome
        option.value = estoque.id
        option.id = `${id}-${estoque.id}`
        select.add(option)

    })
}

const validarFormNovoEstoque = () => {
    return !(
        nome.value.trim() === '' ||
        rua.value.trim() === '' ||
        bairro.value.trim() === '' ||
        numero.value.trim() === ''

    )
}

const criarEstoque = () => {
    if (!validarFormNovoEstoque()) return

    const estoque = new Estoque(nome.value, rua.value, bairro.value, numero.value)
    adicionarEstoqueNaLista(estoque)

    resetFormEstoque()
}

const removerEstoque = () => {
    const dropDownRemoverEstoque = document.getElementById('select-estoque-remover')
    const idEstoqueSelecionado = Number(dropDownRemoverEstoque.value)
    if (!idEstoqueSelecionado) return
    removerEstoquePorId(idEstoqueSelecionado)
}

const myFunctionDeposito = () => {
    const select = document.getElementById('select')
    const itemSelecionado = Number(select.value)
    const itemEncontradoDropDown = tabelaEstoque.find(est => est.id === itemSelecionado)
    if (itemEncontradoDropDown) {
        console.log(itemEncontradoDropDown.criarDeposito(nomeDeposito.value))
    }
    return itemEncontradoDropDown
}

btnCriarDeposito.addEventListener('click', () => {
    const estoque = myFunctionDeposito()
    renderizarDepositoLista(estoque)
})

const renderizarDepositoLista = (estoque) => {
    const tagEstoque = document.getElementById(`estoque_${estoque.id}`)
    const tagDepositoLista = document.createElement('ul')
    tagEstoque.appendChild(tagDepositoLista)
    estoque.depositos.forEach(deposito => {
        const depositoItemTag = document.createElement('li')
        depositoItemTag.appendChild(document.createTextNode(deposito.nome))
        tagDepositoLista.appendChild(depositoItemTag)
    })
}






























// btnCriarDeposito.addEventListener('click', () =>{
//         if (!validarFormNovoDeposito()) return
//     const item = new Deposito(nomeDeposito.value)
//     tabelaDeposito.push(item)

//     resetFormDeposito()
//     console.log(item)
// })










































// const listaItem = document.getElementById('lista-itens')
// const itemListado = document.createElement('li')
// itemListado.appendChild(document.createTextNode(item.nome))
// listaItem.appendChild(itemListado)