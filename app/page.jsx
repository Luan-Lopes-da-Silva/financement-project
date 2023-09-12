'use client'
import { useRef, useState } from 'react'
import html2canvas from 'html2canvas'
import jsPDF from 'jspdf'
import style from './page.module.scss'
import pdfSvg from './src/assets/pdf-svgrepo-com.svg'
import Image from 'next/image'

export default function Home() {
  const simulations = []
  const [imovel,setImovel] = useState('')
  const [financiamento,setFinanciamento] = useState('')
  const [entrada,setEntrada] = useState('')
  const [prazo,setPrazo] = useState('')
  const [juros,setJuros] = useState('6%')
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
  const refTable = useRef()

  function minValues(ev){
    if(ev.currentTarget.value < 40000){
      mensage.current.innerText = 'Valor minimo de imovel R$ 40,000'
    }else{
      mensage.current.innerText = ''
      mensagePorcentagemFinanciamento.current.innerText = ''
      mensageEntrada.current.innerText = ''
      const financiamento = (ev.currentTarget.value * 80) / 100
      setFinanciamento(financiamento)
      setEntrada(imovel-financiamento)
    }
  }

  function maxValue(ev){
    const porcentagem = (ev.currentTarget.value/imovel) * 100 
    if(porcentagem>80){
    mensagePorcentagemFinanciamento.current.innerText = 'Porcentagem máxima de financiamento atingida abaixe o valor'
    }else{
    mensagePorcentagemFinanciamento.current.innerText = ''
    setEntrada(imovel-financiamento) 
    }
  }

  function createSimulation(ev){
    ev.preventDefault()
    const porcentagem = (financiamento/imovel) * 100 
    if(financiamento === '' && imovel === ''){
      mensage.current.innerText = 'Preencha o valor do imovel'
      mensagePorcentagemFinanciamento.current.innerText = 'Preencha o valor do financiamento'
      mensageParcela.current.innerText = 'Preencha o numero de parcelas'
      mensageEntrada.current.innerText = 'Preencha o valor de entrada'
    }else if(imovel === ''){
      mensage.current.innerText = 'Preencha o valor do imovel'
    }else if(financiamento === ''){
      mensagePorcentagemFinanciamento.current.innerText = 'Preencha o valor do financiamento'
    }else if(prazo === ''){
      mensageParcela.current.innerText = 'Preencha o numero de parcelas'
    }else if(entrada === '') {
      mensageEntrada.current.innerText = 'Preencha o valor de entrada'
    }
      else if(porcentagem>80){
      mensagePorcentagemFinanciamento.current.innerText = 'Porcentagem máxima de financiamento atingida abaixe o valor'
    }else{
      refTable.current.style.display = 'block'
      mensagePorcentagemFinanciamento.current.innerText = ''
      mensageParcela.current.innerText = ''
      mensageEntrada.current.innerText = ''
      const values = []
      values.push(Number(financiamento))
      const parcela0Span = document.createElement('p')
      parcela0Span.innerText = 'Parcela 0'
      refParcela.current.appendChild(parcela0Span)

      const parcela0Juros = document.createElement('p')
      parcela0Juros.innerText = '-'
      refJuros.current.appendChild(parcela0Juros)
      
      const parcela0Amortizacao = document.createElement('p')
      parcela0Amortizacao.innerText = '-'
      refAmortizacao.current.appendChild(parcela0Amortizacao)

      const parcela0Valor = document.createElement('p')
      parcela0Valor.innerText = '-'
      refValorParcela.current.appendChild(parcela0Valor)

      const parcela0Saldo = document.createElement('p')
      parcela0Saldo.innerText = 'R$ 000'
      refSaldo.current.appendChild(parcela0Saldo)

      for(let i = 1; i<=Number(prazo); i++){
        values.push((Number(imovel) - Number(entrada)) / prazo)
        var simulation = {
        parcelas:`Parcela ${i}`,
        valorParcela: (Number(imovel) - Number(entrada)) / prazo,
        juros: '0,48',
        financiado: financiamento,
        amortizacao: Number(financiamento) / Number(prazo),
        }
    
        const spanParcela = document.createElement('p')
        spanParcela.innerText = simulation.parcelas
        refParcela.current.appendChild(spanParcela)
  
        const spanJuros = document.createElement('p')
        spanJuros.innerText = simulation.juros
        refJuros.current.appendChild(spanJuros)
        
        const spanAmortizacao = document.createElement('p')
        spanAmortizacao.innerText = simulation.amortizacao
        refAmortizacao.current.appendChild(spanAmortizacao)
  
        const spanValorParcela = document.createElement('p')
        spanValorParcela.innerText = simulation.valorParcela
        refValorParcela.current.appendChild(spanValorParcela)  
        simulations.push(simulation)
    }
        const result = values.reduce((acc,cur)=>{
        const spanSaldo = document.createElement('p')
        spanSaldo.innerText = `R$ ${acc} - R$ ${cur} = R$ ${acc-cur}`
        refSaldo.current.appendChild(spanSaldo)
        return acc-cur
        })
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

  function verifyField(){
  if(prazo!==''){
    mensageParcela.current.innerText = ''
  }else{
    mensageParcela.current.innerText = 'Preencha o numero de parcelas'
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
      onSubmit={(ev)=>createSimulation(ev)}
      >
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
          onKeyUp ={verifyField}
          />
        </div>
        <label htmlFor="juros">Taxa juros</label>
        <input 
        type="text" 
        name="juros"
        value={juros}
        onChange={(ev)=>setJuros(ev.currentTarget.value)}
        />
        <button>Simular</button>
       
      </form>
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
    <button button onClick={downloadPDF}>
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
