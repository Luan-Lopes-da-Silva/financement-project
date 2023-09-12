'use client'
import { useRef, useState } from 'react'
import style from './page.module.css'
import html2canvas from 'html2canvas'
import jsPDF from 'jspdf'

export default function Home() {
  const simulations = []
  const [imovel,setImovel] = useState('')
  const [financiamento,setFinanciamento] = useState('')
  const [entrada,setEntrada] = useState('')
  const [prazo,setPrazo] = useState('')
  const [juros,setJuros] = useState('6%')
  const [simul , setSimul] = useState([])
  const refParcela = useRef(null)
  const refJuros = useRef(null)
  const refAmortizacao = useRef(null)
  const refValorParcela = useRef(null)
  const refSaldo = useRef(null)
  const targetRef = useRef()

  function createSimulation(ev){
    ev.preventDefault()
    const values = []
    values.push(Number(financiamento))
  for(let i = 1; i<Number(prazo); i++){
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
  setSimul(state => [...state,simulation])
  }
  const result = values.reduce((acc,cur)=>{
    const spanSaldo = document.createElement('p')
    spanSaldo.innerText = `R$ ${acc} - R$ ${cur} = R$ ${acc-cur}`
    refSaldo.current.appendChild(spanSaldo)
    return acc-cur
  })
  }

  const downloadPDF = () =>{
    const table = targetRef.current
    console.log(table)
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
    <>
    <main>
      <form 
      className={style.form}
      onSubmit={(ev)=>createSimulation(ev)}
      >
        <label htmlFor="valorImovel">Valor do imovel</label>
        <input 
        type="text" 
        name="valorImovel"
        value={imovel}
        onChange={(ev)=>setImovel(ev.currentTarget.value)}
        />
        
        <label htmlFor="valorEntrada">Valor da entrada</label>
        <input 
        type="text" 
        name="valorEntrada"
        value={entrada}
        onChange={(ev)=>setEntrada(ev.currentTarget.value)}
        onKeyUp={(ev)=>setFinanciamento(Number(imovel) - Number(ev.currentTarget.value))}
        />

        <label htmlFor="valorFinanciamento">Valor do financiamento</label>
        <input 
        type="text" 
        name="valorFinanciamento" 
        value={financiamento}
        onChange={(ev)=>setFinanciamento(ev.currentTarget.value)}
        />
        <label htmlFor="prazoFinanciamento">Prazo financiamento</label>
        <input 
        type="text" 
        name="prazoFinanciamento" 
        value={prazo}
        onChange={(ev)=>setPrazo(ev.currentTarget.value)}
        />
        <label htmlFor="juros">Taxa juros</label>
        <input 
        type="text" 
        name="juros"
        value={juros}
        onChange={(ev)=>setJuros(ev.currentTarget.value)}
        />
        <button>Simular</button>
       
      </form>
    <table ref={targetRef}>
  <tr>
    <th style={{color:'red'}}>Parcelas</th>
    <th style={{color:'red'}}>Juros</th>
    <th style={{color:'red'}}>Amortização</th>
    <th style={{color:'red'}}>Valor Parcela</th>
    <th style={{color:'red'}}>Saldo devedor</th>
  </tr>
  <tr>
    <td style={{color:'red'}} ref={refParcela}></td>
    <td style={{color:'red'}} ref={refJuros}></td>
    <td style={{color:'red'}} ref={refAmortizacao}></td>
    <td style={{color:'red'}} ref={refValorParcela}></td>
    <td style={{color:'red'}} ref={refSaldo}></td>
  </tr>

</table>
<button onClick={downloadPDF}>Gerar PDF</button> 
    </main>
    </>
  )
}
