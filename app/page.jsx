'use client'
import { useRef, useState } from 'react'
import html2canvas from 'html2canvas'
import jsPDF from 'jspdf'
import style from './page.module.scss'
import pdfSvg from './src/assets/pdf-svgrepo-com.svg'
import autoTable from 'jspdf-autotable'
import Image from 'next/image'
import SimulationsPDF from './Reports/Simulations/Simulations'

export default function Home() {
  const simulations = []
  const saldoDevedor  = []
  const parcelas = []
  const [imovel,setImovel] = useState('')
  const [despesas,setDespesas] = useState('')
  const [amortizacao,setAmortizacao] = useState('Selecione seu sistema de amortização')
  const [aniversario,setAniversario] = useState('')
  const [banco,setBanco] = useState('Selecione um banco')
  const [financiamento,setFinanciamento] = useState('')
  const [entrada,setEntrada] = useState('')
  const [prazo,setPrazo] = useState('')
  const [juros,setJuros] = useState('')
  const refResumo = useRef(null)
  const mensage = useRef()
  const mensagePorcentagemFinanciamento = useRef()
  const mensageEntrada = useRef()
  const mensageParcela = useRef()
  const mensageBanco = useRef()
  const mensageJuros = useRef()
  const btnRef = useRef()
  const btnLimpar = useRef()
  const mensageAniversario = useRef()
  const mensageAmortizacao = useRef()
  const mensageDespesa = useRef()
  const formRef = useRef()
  const outputRef = useRef()
  const valorDespesa = Number(imovel)*0.05
  const conta = valorDespesa + Number(financiamento)

  
  function despesasFunction(ev){
  const maxFinanciamento = imovel*0.080 
  if(ev==='Sim' && conta>maxFinanciamento){
    setDespesas(ev)
    outputRef.current.style.display = 'block'
    mensagePorcentagemFinanciamento.current.innerText = 'Porcentagem máxima de financiamento atingida abaixe o valor'
  }else if(ev==='Sim' && conta<maxFinanciamento){
    setDespesas(ev)
    outputRef.current.style.display = 'block'
    mensagePorcentagemFinanciamento.current.innerText = ''
  }else{
    setDespesas(ev)
    outputRef.current.style.display = 'none'
  }
  }
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

 function checkSistema(ev){
  setAmortizacao(ev.currentTarget.value)
  if(ev.currentTarget.value === 'Selecione seu sistema de amortização'){
  mensageAmortizacao.current.innerText = 'Selecione um sistema'
  }else{
  mensageAmortizacao.current.innerText = ''
  }
 }


function maxPrazos(ev){
  const target = ev.currentTarget
  const nascimentoConvertido = new Date(aniversario).getFullYear()
  const anoAtual = new Date().getFullYear()
  const conta = (anoAtual-nascimentoConvertido) + Number(ev.currentTarget.value)/12
  
  setPrazo(target.value)
  if(Number(ev.currentTarget.value)<3){
    mensageParcela.current.innerText = 'Numero minimo de parcelas 12'
  }
  else if(banco === 'bradesco' && ev.currentTarget.value>420){
   mensageParcela.current.innerText = 'Numero maximo de parcelas 420'
  }else if(banco === 'bradesco' && conta>80){
  const sobra = (conta-80)*12 
  mensageParcela.current.innerText = `Devido as politicas do banco seu novo limite de parcelas é ${420-sobra.toFixed(0)}`
  }else{
   mensageParcela.current.innerText = ''
  }
}

  function minValues(ev){
    const valorEntrada = (ev.currentTarget.value*20) /100
    if(ev.currentTarget.value < 50){
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
    setJuros('6%')
    mensageParcela.current.innerText = ''
    mensageJuros.current.innerText = ''
    mensageBanco.current.innerText = ''
  }else{
    mensageBanco.current.innerText = 'Selecione um banco valido para dar continuidade'
    console.log('Outro banco')
  }
  }

  function limparCampos(){
    setImovel('')
    setFinanciamento('')
    setEntrada('')
    setPrazo('')
    setBanco('Selecione um banco')
    setJuros('')
    setAniversario('')
    setAmortizacao('Selecione seu sistema de amortização')
    setDespesas('')
    outputRef.current.style.display = 'none'
    refResumo.current.style.display = 'none'
  }

  function createSimulation(ev){
    ev.preventDefault()
    const jurosConvertido = juros.replace(/%/g,'')
    const taxaConta = 1/12
    const contaTaxa = Number(((jurosConvertido/100)+1)**taxaConta)-1
 
    const nascimento = new Date(aniversario).getFullYear()
    const anoAtual = new Date().getFullYear()
    const conta = (anoAtual-nascimento) + Number(prazo)/12
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
    }else if(Number(prazo)<3){
      mensageParcela.current.innerText = 'Numero de parcelas mininimas é 12.'
    }else if(banco === 'bradesco' && conta>80){
      const sobra = (conta-80)*12 
      mensageParcela.current.innerText = `Devido as politicas do banco seu novo limite de parcelas é ${420-sobra.toFixed(0)}`
    }else if(amortizacao === 'Selecione seu sistema de amortização'){
      mensageAmortizacao.current.innerText = 'Selecione um sistema '
    }else if(despesas === ''){
      mensageDespesa.current.innerText = 'Selecione uma alternativa'
    }else if(amortizacao === 'SAC' && banco=== 'bradesco'){
      const taxaBradesco = '10.49%'
      btnLimpar.current.style.marginTop = '-56px'
      btnLimpar.current.style.marginLeft = '200px'
      refResumo.current.style.display = 'block'
      mensagePorcentagemFinanciamento.current.innerText = ''
      mensageParcela.current.innerText = ''
      mensageEntrada.current.innerText = ''
      mensageBanco.current.innerText = ''
      mensageAniversario.current.innerText = ''
      mensageJuros.current.innerText = ''
      mensageAmortizacao.current.innerText = ''
      mensageDespesa.current.innerText = ''
      const values = []
      values.push(Number(financiamento))
      
      
    
      for(let i = 1; i<=Number(prazo); i++){
        values.push((Number(imovel) - Number(entrada)) / prazo)
      }

      const result = values.reduce((acc,cur)=>{
        saldoDevedor.push((acc-cur).toFixed(2))
        return acc-cur
      })

      const amort = Number(financiamento) / Number(prazo)
     
  
      for(let i = 1; i<=Number(prazo); i++){
        const parcela = (((5-[i]+1)*contaTaxa)+1)*amort
        parcelas.push(parcela)
        var simulation = {
        parcelas:`Parcela ${i}`,
        valorParcela: parcela.toFixed(2),
        juros: (parcela-amort).toFixed(2),
        financiado: financiamento,
        amortizacao: amort.toFixed(2),
        saldoDevedor: saldoDevedor[i-1]
        }
        simulations.push(simulation)  
    }
   
    formRef.current.addEventListener('onSubmit',(ev)=>SimulationsPDF(ev,simulations))
  
    }else if(amortizacao === 'PRICE' && banco=== 'bradesco'){
      const taxaBradesco = '10.49%'
      btnLimpar.current.style.marginTop = '-56px'
      btnLimpar.current.style.marginLeft = '200px'
      refResumo.current.style.display = 'block'
      mensagePorcentagemFinanciamento.current.innerText = ''
      mensageParcela.current.innerText = ''
      mensageEntrada.current.innerText = ''
      mensageBanco.current.innerText = ''
      mensageAniversario.current.innerText = ''
      mensageJuros.current.innerText = ''
      mensageAmortizacao.current.innerText = ''
      mensageDespesa.current.innerText = ''
      const values = []
      values.push(Number(financiamento))
      
    
      for(let i = 1; i<=Number(prazo); i++){
        values.push((Number(imovel) - Number(entrada)) / prazo)
      }

      

      const result = values.reduce((acc,cur)=>{
        saldoDevedor.push((acc-cur).toFixed(2))
        return acc-cur
      })
      saldoDevedor.unshift(financiamento)
      const amort = Number(financiamento) / Number(prazo)
     
  
      for(let i = 1; i<=Number(prazo); i++){
        const parcela = Number(financiamento)*(((1+contaTaxa)**Number(prazo))*contaTaxa)/((((1+contaTaxa)**prazo)-1))
        parcelas.push(parcela)
        var simulation = {
        parcelas:`Parcela ${i}`,
        valorParcela: parcela.toFixed(2),
        juros: (saldoDevedor[i-1]*contaTaxa).toFixed(2),
        financiado: financiamento,
        amortizacao: (parcela - (saldoDevedor[i-1]*contaTaxa)).toFixed(2) ,
        saldoDevedor: saldoDevedor[i]
        }
        simulations.push(simulation)  
    }
 
    formRef.current.addEventListener('onSubmit',(ev)=>SimulationsPDF(ev,simulations))
  }
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
      ref={formRef}
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

        <div>
          <label htmlFor="">Sistema amortização</label>
          <span className={style.errorSpan} ref={mensageAmortizacao}></span>
          <select
          value={amortizacao}
          onChange={(ev)=>checkSistema(ev)}
          >
            <option value="Selecione seu sistema de amortização" selected>Selecione seu sistema de amortização</option>
            <option value="SAC">SAC</option>
            <option value="PRICE">PRICE</option>
          </select>
        </div>
        <label htmlFor="juros">Taxa juros</label>
        <span className={style.errorSpan} ref={mensageJuros}></span>
        <input 
        type="text" 
        name="juros"
        value={juros}
        onChange={(ev)=>setJuros(ev.currentTarget.value)}
        />
        <label htmlFor="despesas">Incluir despesas?</label>
        <span className={style.errorSpan} ref={mensageDespesa}></span>
        <div className={style.radioContainer}>
          <div className={style.radio}>
            <label htmlFor="sim">Sim</label>
            <input
            type="radio"
            name="despesas"
            checked={despesas === 'Sim'}
            value={'Sim'}
            onChange={(ev)=>despesasFunction(ev.currentTarget.value)}
            />
          </div>
          <div className={style.radio}>
            <label htmlFor="nao">Não</label>
            <input
            type="radio"
            name="despesas"
            checked={despesas === 'Não'}
            value={'Não'}
            onChange={(ev)=>despesasFunction(ev.currentTarget.value)}
            />
          </div>
        </div>
        <div className={style.outputContainer}>
          <input 
          type="text" 
          ref={outputRef} 
          className={style.outputRef}
          value={valorDespesa}
          />
        </div>
        <button
        ref={btnRef}
        className={style.btn1}
        onClick={createSimulation}
        >Simular</button>
      </form>
      <button
        onClick={limparCampos}
        className={style.btn2}
        ref={btnLimpar}
        >
          Limpar
      </button>
      {despesas === 'Sim'?(
      <div className={style.summary} ref={refResumo}>
        <h1>Resumo do financiamento</h1>
        <h4>Valor Imovel: R$ {imovel}</h4>
        <h4>Valor Financiamento: R$ {financiamento}</h4>
        <h4>Valor Entrada: R$ {entrada}</h4>
        <h4>Renda Minima: (NÃO INFORMADO)</h4>
        <h4>Despesas: R$ {Number(valorDespesa).toFixed(2)}</h4>
        <h4>Vistoria: R$ 2.114,03</h4>
        <h4>Valor Total Financiado: R$ {Number(conta).toFixed(2)}</h4>
      <h4>Prazo: {prazo} meses</h4>
      
      <h4>Valor CET: (NÃO INFORMADO)</h4>
      <h4>Valor CESH: (NÃO INFORMADO)</h4>
      <h4>Taxa Efetiva: {juros}</h4>
      <h4>Taxa Nominal: (NÃO INFORMADO)</h4>
      <button className={style.btnPdf}>
    <Image
    alt='pdfBtn'
    src={pdfSvg}
    width={30}
    onClick={()=>SimulationsPDF(simulations)}
    />
    </button> 
      </div>
      ):(
      <div className={style.summary} ref={refResumo}>
      <h1>Resumo do financiamento</h1>
      <h4>Valor Imovel: R$ {imovel}</h4>
      <h4>Valor Financiamento: R$ {financiamento}</h4>
      <h4>Valor Entrada: R$ {entrada}</h4>
      <h4>Renda Minima: (NÃO INFORMADO)</h4>
      <h4>Despesas: (NÃO INFORMADO)</h4>
      <h4>Vistoria: R$ 2.114,03</h4>
      <h4>Valor Total Financiado: R$ {Number(financiamento).toFixed(2)}</h4>
      <h4>Prazo: {prazo} meses</h4>
      
      <h4>Valor CET: (NÃO INFORMADO)</h4>
      <h4>Valor CESH: (NÃO INFORMADO)</h4>
      <h4>Taxa Efetiva: {juros}</h4>
      <h4>Taxa Nominal: (NÃO INFORMADO)</h4>
      <button className={style.btnPdf}>
      <Image
      alt='pdfBtn'
      src={pdfSvg}
      width={30}
      onClick={()=>SimulationsPDF(simulations)}
      />
      </button> 
      </div>
      )}
    

   

    
  

   
    </main>
    </div>
  )
}
