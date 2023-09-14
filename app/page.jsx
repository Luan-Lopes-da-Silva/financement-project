'use client'
import { useRef, useState } from 'react'
import html2canvas from 'html2canvas'
import jsPDF from 'jspdf'
import style from './page.module.scss'
import pdfSvg from './src/assets/pdf-svgrepo-com.svg'
import clear from './src/assets/clear.svg'
import Image from 'next/image'

export default function Home() {
  const simulations = []
  const [imovel,setImovel] = useState('')
  const [aniversario,setAniversario] = useState('')
  const [banco,setBanco] = useState('Selecione um banco')
  const [financiamento,setFinanciamento] = useState('')
  const [entrada,setEntrada] = useState('')
  const [prazo,setPrazo] = useState('')
  const [juros,setJuros] = useState('')
  const refParcela = useRef(null)
  const refJuros = useRef(null)
  const refAmortizacao = useRef(null)
  const refValorParcela = useRef(null)
  const refSaldo = useRef(null)
  const targetRef = useRef()
  const mensage = useRef()
  const mensagePorcentagemFinanciamento = useRef()
  const mensageEntrada = useRef()
  const mensageParcela = useRef()
  const mensageBanco = useRef()
  const mensageJuros = useRef()
  const refTable = useRef()
  const btnRef = useRef()
  const btnAtualizar = useRef()
  const btnLimpar = useRef()
  const mensageAniversario = useRef()

  function checkIdade(ev){
    
    const nascimento = ev.currentTarget.value
    const nascimentoConvertido = new Date(nascimento).getFullYear()
    const anoAtual = new Date().getFullYear()
    setAniversario(ev.currentTarget.value)
    if(anoAtual-nascimentoConvertido>80){
      mensageAniversario.current.innerText = 'Idade acima do permitido para financiamento.'
    }else if(anoAtual-nascimentoConvertido<18){
      mensageAniversario.current.innerText = 'Idade abaixo do permitido para financiamento.'
    }else{
      mensageAniversario.current.innerText = ''
    }
  }
 
  function checkField(ev){
  const div =  ev.currentTarget.parentElement
  const span = div.querySelector('span')
  const valorEntrada = (imovel*20) /100
  if(ev.currentTarget.value === '' || ev.currentTarget.value === '0'){
    span.innerText = 'Preencha esse campo corretamente'
  }else if(ev.currentTarget.name === 'valorEntrada'  && ev.currentTarget.value<valorEntrada){
    span.innerText = `Valor minimo de entrada R$ ${valorEntrada},00`
  }else{
    span.innerText = ''
  }
 }


function maxPrazos(ev){
  const target = ev.currentTarget
  setPrazo(target.value)
  if(Number(ev.currentTarget.value)<12){
    mensageParcela.current.innerText = 'Numero minimo de parcelas 12'
  }
  else if(banco === 'bradesco' && ev.currentTarget.value>420){
   mensageParcela.current.innerText = 'Limite de parcelas para esse banco ja foi atingida'
  }else{
   mensageParcela.current.innerText = ''
  }
}

  function minValues(ev){
    const valorEntrada = (ev.currentTarget.value*20) /100
    if(ev.currentTarget.value < 40000){
      mensage.current.innerText = 'Valor minimo de imovel R$ 40,000'
    }else{
      mensage.current.innerText = ''
      mensagePorcentagemFinanciamento.current.innerText = ''
      mensageEntrada.current.innerText = ''
      mensageParcela.current.innerText = ''
      const financiamento = (ev.currentTarget.value * 80) / 100
      setFinanciamento(financiamento)
      setEntrada(valorEntrada)
    }
  }

  function maxValue(ev){
    const porcentagem = (ev.currentTarget.value/imovel) * 100 
    if(porcentagem>80){
    mensagePorcentagemFinanciamento.current.innerText = 'Porcentagem máxima de financiamento atingida abaixe o valor'
    }else{
    mensagePorcentagemFinanciamento.current.innerText = ''
    }
  }

  function bancoPrazo(ev){
  const target = ev.currentTarget
  setBanco(target.value)
  if(banco !='Selecione um banco'){
  mensageJuros.current.innerText = ''
  mensageBanco.current.innerText = ''
  }
  else if(target.value === 'bradesco'){
    setPrazo(420)
    setJuros('6%')
    mensageParcela.current.innerText = ''
    mensageJuros.current.innerText = ''
    mensageBanco.current.innerText = ''
  }else{
    mensageBanco.current.innerText = 'Selecione um banco valido para dar continuidade'
    console.log('Outro banco')
  }
  }

  function clearTable(){
    const valorEntrada = (imovel*20) /100
    const porcentagem = (financiamento/imovel) * 100 
    const nascimento = new Date(aniversario).getFullYear()
    const anoAtual = new Date().getFullYear()

    if(banco === 'Selecione um banco'){
      mensageBanco.current.innerText = 'Selecione um banco valido para dar continuidade'
      mensageJuros.current.innerText = 'Preencha a taxa de juros'
    } 
    else if(aniversario === ''){
      mensageAniversario.current.innerText = 'Preencha com sua data de nascimento para dar continuidade.'
    }else if(anoAtual-nascimento>80){
      mensageAniversario.current.innerText = 'Idade acima do permitido para financiamento.'
    }else if(anoAtual-nascimento<18){
      mensageAniversario.current.innerText = 'Idade abaixo do permitido para financiamento.'
    }
    else if(financiamento === '' && imovel === ''){
    mensage.current.innerText = 'Preencha o valor do imovel'
    mensagePorcentagemFinanciamento.current.innerText = 'Preencha o valor do financiamento'
    mensageEntrada.current.innerText = 'Preencha o valor de entrada'
    mensageBanco.current.innerText = ''
    mensageJuros.current.innerText = ''
    mensageAniversario.current.innerText = ''
  }else if(financiamento === 0 && imovel === 0){
    mensageEntrada.current.innerText = 'Preencha o valor de entrada'
    mensage.current.innerText = 'Preencha o valor do imovel'
    mensagePorcentagemFinanciamento.current.innerText = 'Preencha o valor do financiamento'
    mensageEntrada.current.innerText = 'Preencha o valor de entrada'
    mensageBanco.current.innerText = ''
    mensageJuros.current.innerText = ''
    mensageAniversario.current.innerText = ''
  }else if(imovel === 0){
    mensage.current.innerText = 'Preencha o valor do imovel'
  }else if(financiamento === 0){
    mensagePorcentagemFinanciamento.current.innerText = 'Preencha o valor do financiamento'
  }else if(prazo === ''){
    mensageParcela.current.innerText = 'Preencha o numero de parcelas'
  }else if(entrada === '') {
    mensageEntrada.current.innerText = 'Preencha o valor de entrada'
  }else if(porcentagem>80){
    mensagePorcentagemFinanciamento.current.innerText = 'Porcentagem máxima de financiamento atingida abaixe o valor'
  }else if(banco === 'bradesco' && prazo>420){
    mensageParcela.current.innerText = 'Numero de parcelas acima do limite pra esse banco'
  }else if(entrada<valorEntrada){
    mensageEntrada.current.innerText = `Valor minimo de entrada R$ ${valorEntrada},00`
  }else if(juros === ''){
    mensageJuros.current.innerText = 'Preencha a taxa de juros de acordo com o seu banco.'
  }else if(Number(prazo)<12){
    mensageParcela.current.innerText = 'Numero de parcelas mininimas é 12.'
  }else{
    while(refJuros.current.hasChildNodes()){
      refJuros.current.removeChild(refJuros.current.firstChild)
      refParcela.current.removeChild(refParcela.current.firstChild)
      refAmortizacao.current.removeChild(refAmortizacao.current.firstChild)
      refSaldo.current.removeChild(refSaldo.current.firstChild)
      refValorParcela.current.removeChild(refValorParcela.current.firstChild)
    }

    btnLimpar.current.style.marginTop = '0px'
    btnLimpar.current.style.marginLeft = '200px'
    refTable.current.style.display = 'block'
    mensagePorcentagemFinanciamento.current.innerText = ''
    mensageParcela.current.innerText = ''
    mensageEntrada.current.innerText = ''
    mensageBanco.current.innerText = ''
    mensageJuros.current.innerText = ''
    mensageAniversario.current.innerText = ''

  const values = []
  values.push(Number(financiamento))
  const parcela0Span = document.createElement('p')
  parcela0Span.innerText = 'Parcela 0'
  appendChildOnce(refParcela.current,parcela0Span)

  const parcela0Juros = document.createElement('p')
  parcela0Juros.innerText = '-'
  appendChildOnce(refJuros.current,parcela0Juros)
  
  const parcela0Amortizacao = document.createElement('p')
  parcela0Amortizacao.innerText = '-'
  appendChildOnce(refAmortizacao.current,parcela0Amortizacao)

  const parcela0Valor = document.createElement('p')
  parcela0Valor.innerText = '-'
  appendChildOnce(refValorParcela.current,parcela0Valor)


  const parcela0Saldo = document.createElement('p')
  parcela0Saldo.innerText = 'R$ 000'
  appendChildOnce(refSaldo.current,parcela0Saldo)
  const amort = Number(financiamento) / Number(prazo)
  const parc = (Number(imovel) - Number(entrada)) / prazo
  for(let i = 1; i<=Number(prazo); i++){
    values.push((Number(imovel) - Number(entrada)) / prazo)
    var simulation = {
    parcelas:`Parcela ${i}`,
    valorParcela: parc.toFixed(2),
    juros: '0,48',
    financiado: financiamento,
    amortizacao: amort.toFixed(2),
    }

    const spanParcela = document.createElement('p')
    spanParcela.innerText = simulation.parcelas
    appendChildOnce(refParcela.current,spanParcela)

    const spanJuros = document.createElement('p')
    spanJuros.innerText = simulation.juros
    appendChildOnce(refJuros.current,spanJuros)
    
    const spanAmortizacao = document.createElement('p')
    spanAmortizacao.innerText = simulation.amortizacao
    appendChildOnce(refAmortizacao.current,spanAmortizacao)

    const spanValorParcela = document.createElement('p')
    spanValorParcela.innerText = simulation.valorParcela
    appendChildOnce(refValorParcela.current,spanValorParcela)
    simulations.push(simulation)
}
    const result = values.reduce((acc,cur)=>{
    const spanSaldo = document.createElement('p')
    spanSaldo.innerText = `R$ ${acc.toFixed(2)} - R$ ${cur.toFixed(2)} = R$ ${(acc-cur).toFixed(2)}`
    appendChildOnce(refSaldo.current,spanSaldo)
    return acc-cur
    })

    setImovel('')
    setFinanciamento('')
    setEntrada('')
    setPrazo('')
    setBanco('Selecione um banco')
    setJuros('')
  }
  
  }

  function appendChildOnce(parentElement, childElement){
    if(!parentElement.contains(childElement)){
        parentElement.appendChild(childElement)
    }
  }

  function limparCampos(){
    setImovel('')
    setFinanciamento('')
    setEntrada('')
    setPrazo('')
    setBanco('Selecione um banco')
    setJuros('')
  }

  function createSimulation(ev){
    ev.preventDefault()
    const nascimento = new Date(aniversario).getFullYear()
    const anoAtual = new Date().getFullYear()
    
    const valorEntrada = (imovel*20) /100
    const porcentagem = (financiamento/imovel) * 100
    if(banco === 'Selecione um banco'){
      mensageBanco.current.innerText = 'Selecione um banco valido para dar continuidade'
      mensageJuros.current.innerText = 'Preencha a taxa de juros'
    } 
    else if(aniversario === ''){
      mensageAniversario.current.innerText = 'Preencha com sua data de nascimento para dar continuidade.'
    }else if(anoAtual-nascimento>80){
      mensageAniversario.current.innerText = 'Idade acima do permitido para financiamento.'
    }else if(anoAtual-nascimento<18){
      mensageAniversario.current.innerText = 'Idade abaixo do permitido para financiamento.'
    }
    else if(financiamento === '' && imovel === ''){
      mensage.current.innerText = 'Preencha o valor do imovel'
      mensagePorcentagemFinanciamento.current.innerText = 'Preencha o valor do financiamento'
      mensageEntrada.current.innerText = 'Preencha o valor de entrada'
      mensageBanco.current.innerText = ''
      mensageJuros.current.innerText = ''
      mensageAniversario.current.innerText = ''
    }else if(financiamento === 0 && imovel === 0){
      mensageEntrada.current.innerText = 'Preencha o valor de entrada'
      mensage.current.innerText = 'Preencha o valor do imovel'
      mensagePorcentagemFinanciamento.current.innerText = 'Preencha o valor do financiamento'
      mensageEntrada.current.innerText = 'Preencha o valor de entrada'
      mensageBanco.current.innerText = ''
      mensageJuros.current.innerText = ''
      mensageAniversario.current.innerText = ''
    }else if(imovel === 0){
      mensage.current.innerText = 'Preencha o valor do imovel'
    }else if(financiamento === 0){
      mensagePorcentagemFinanciamento.current.innerText = 'Preencha o valor do financiamento'
    }else if(prazo === ''){
      mensageParcela.current.innerText = 'Preencha o numero de parcelas'
    }else if(entrada === '') {
      mensageEntrada.current.innerText = 'Preencha o valor de entrada'
    }else if(porcentagem>80){
      mensagePorcentagemFinanciamento.current.innerText = 'Porcentagem máxima de financiamento atingida abaixe o valor'
    }else if(banco === 'bradesco' && prazo>420){
      mensageParcela.current.innerText = 'Numero de parcelas acima do limite pra esse banco'
    }else if(entrada<valorEntrada){
      mensageEntrada.current.innerText = `Valor minimo de entrada R$ ${valorEntrada},00`
    }else if(juros === ''){
      mensageJuros.current.innerText = 'Preencha a taxa de juros de acordo com o seu banco.'
    }else if(Number(prazo)<12){
      mensageParcela.current.innerText = 'Numero de parcelas mininimas é 12.'
    }else{
      btnLimpar.current.style.marginTop = '0px'
      btnLimpar.current.style.marginLeft = '200px'
      refTable.current.style.display = 'block'
      mensagePorcentagemFinanciamento.current.innerText = ''
      mensageParcela.current.innerText = ''
      mensageEntrada.current.innerText = ''
      mensageBanco.current.innerText = ''
      mensageAniversario.current.innerText = ''
      mensageJuros.current.innerText = ''
      const values = []
      values.push(Number(financiamento))
      const parcela0Span = document.createElement('p')
      parcela0Span.innerText = 'Parcela 0'
      appendChildOnce(refParcela.current,parcela0Span)

      const parcela0Juros = document.createElement('p')
      parcela0Juros.innerText = '-'
      appendChildOnce(refJuros.current,parcela0Juros)
      
      const parcela0Amortizacao = document.createElement('p')
      parcela0Amortizacao.innerText = '-'
      appendChildOnce(refAmortizacao.current,parcela0Amortizacao)

      const parcela0Valor = document.createElement('p')
      parcela0Valor.innerText = '-'
      appendChildOnce(refValorParcela.current,parcela0Valor)
  

      const parcela0Saldo = document.createElement('p')
      parcela0Saldo.innerText = 'R$ 000'
      appendChildOnce(refSaldo.current,parcela0Saldo)
      const amort = Number(financiamento) / Number(prazo)
      const parc = (Number(imovel) - Number(entrada)) / prazo
      for(let i = 1; i<=Number(prazo); i++){
        values.push((Number(imovel) - Number(entrada)) / prazo)
        var simulation = {
        parcelas:`Parcela ${i}`,
        valorParcela: parc.toFixed(2),
        juros: '0,48',
        financiado: financiamento,
        amortizacao: amort.toFixed(2),
        }
    
        const spanParcela = document.createElement('p')
        spanParcela.innerText = simulation.parcelas
        appendChildOnce(refParcela.current,spanParcela)
  
        const spanJuros = document.createElement('p')
        spanJuros.innerText = simulation.juros
        appendChildOnce(refJuros.current,spanJuros)
        
        const spanAmortizacao = document.createElement('p')
        spanAmortizacao.innerText = simulation.amortizacao
        appendChildOnce(refAmortizacao.current,spanAmortizacao)
  
        const spanValorParcela = document.createElement('p')
        spanValorParcela.innerText = simulation.valorParcela
        appendChildOnce(refValorParcela.current,spanValorParcela)
        simulations.push(simulation)
    }
        const result = values.reduce((acc,cur)=>{
        const spanSaldo = document.createElement('p')
        spanSaldo.innerText = `R$ ${acc.toFixed(2)} - R$ ${cur.toFixed(2)} = R$ ${(acc-cur).toFixed(2)}`
        appendChildOnce(refSaldo.current,spanSaldo)
        return acc-cur
        })

        setImovel('')
        setFinanciamento('')
        setEntrada('')
        setPrazo('')
        setBanco('Selecione um banco')
        setJuros('')
        btnRef.current.style.display='none'
        btnAtualizar.current.style.display = 'block'
    } 
    
  }

  const downloadPDF = () =>{
      const table = targetRef.current
      html2canvas(table,{logging:true, letterRendering:1 , useCORS: true}).then(canvas=>{
       const imgWidth = 208
       const imgHeight= canvas.height * imgWidth / canvas.width 
       const imgData = canvas.toDataURL('img/png')
       const pdf = new jsPDF('p','mm','a4')
       pdf.addImage(imgData,'PNG',0,0,imgWidth,imgHeight)
       pdf.save('simulation.pdf')
      })
  }
  
  return (
    <div className={style.container}>
    <header>
      <h1>Logo</h1>
      <nav>
        <ul>
          <li>Home</li>
          <li>Services</li>
          <li>About us</li>
        </ul>
      </nav>
    </header>
    <main className={style.main}>
      <form 
      className={style.form}
      onSubmit={(ev)=>createSimulation(ev)}
      >
          <div>
          <label htmlFor="banco">Banco</label>
          <span className={style.errorSpan} ref={mensageBanco}></span>
          <select
          value={banco}
          onChange={(ev)=> bancoPrazo(ev)}
          >
            <option value="">Selecione um banco</option>
            <option value="bradesco">Bradesco</option>
            <option value="santander">Santander</option>
            <option value="itau">Itau</option>
          </select>
        </div>

        <label htmlFor="aniversario">Data de nascimento</label>
        <span className={style.errorSpan} ref={mensageAniversario}></span>
        <input 
        type="date" 
        value={aniversario}
        onChange={(ev)=>checkIdade(ev)}        
        />
        <div>
          <label htmlFor="valorImovel">Valor do imovel</label>
          <span className={style.errorSpan} ref={mensage}></span>
          <input
          type="text"
          name="valorImovel"
          value={imovel}
          onChange={(ev)=>setImovel(ev.currentTarget.value)}
          onKeyUp={(ev)=>minValues(ev)}
          />
        </div>
        <div>
          <label htmlFor="valorFinanciamento">Valor do financiamento</label>
          <span className={style.errorSpan} ref={mensagePorcentagemFinanciamento}></span>
          <input
          type="text"
          name="valorFinanciamento"
          value={financiamento}
          onChange={(ev)=>setFinanciamento(ev.currentTarget.value)}
          onKeyUp={(ev)=>maxValue(ev)}
          />
        </div>
        <div>
          <label htmlFor="valorEntrada">Valor da entrada</label>
          <span className={style.errorSpan} ref={mensageEntrada}></span>
          <input
          type="text"
          name="valorEntrada"
          value={entrada}
          onChange={(ev)=>setEntrada(ev.currentTarget.value)}
          onKeyUp={(ev)=>checkField(ev)}
          />
        </div>

    
        <div>
          <label htmlFor="prazoFinanciamento">Prazo financiamento</label>
          <span className={style.errorSpan} ref={mensageParcela}></span>
          <input
          type="text"
          name="prazoFinanciamento"
          value={prazo}
          onChange={(ev)=>setPrazo(ev.currentTarget.value)}
          onKeyUp ={(ev)=>maxPrazos(ev)}
          />
        </div>
        <label htmlFor="juros">Taxa juros</label>
        <span className={style.errorSpan} ref={mensageJuros}></span>
        <input 
        type="text" 
        name="juros"
        value={juros}
        onChange={(ev)=>setJuros(ev.currentTarget.value)}
        />
        <button
        ref={btnRef}
        className={style.btn1}
        >Simular</button>
       
      </form>
      <button
        onClick={limparCampos}
        className={style.btn2}
        ref={btnLimpar}
        >
          Limpar
        </button>

        <button
        ref={btnAtualizar}
        className={style.btn3}
        onClick={clearTable}
        >
          Atualizar
        </button>
  <div 
  className={style.tableContainer}
  ref={refTable}
  >
    <table ref={targetRef} className={style.table}>
        <thead>
          <tr className={style.header}>
            <th>Parcelas</th>
            <th>Juros</th>
            <th>Amortizacao</th>
            <th>Valor Parcela</th>
            <th>Saldo devedor</th>
          </tr>
        </thead>
        <tbody>
          <tr className={style.content}>
            <td ref={refParcela}></td>
            <td ref={refJuros}></td>
            <td ref={refAmortizacao}></td>
            <td ref={refValorParcela}></td>
            <td ref={refSaldo}></td>
          </tr>
        </tbody>
    </table>
    <button onClick={downloadPDF} className={style.btnPdf}>
    <Image
    alt='pdfBtn'
    src={pdfSvg}
    width={30}
    />
    </button> 
  </div>
    </main>
    </div>
  )
}
