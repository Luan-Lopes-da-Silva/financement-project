'use client'
import { useState } from 'react'
import style from './page.module.css'
import SimulationPDF from './Reports/Simulations/simulation'

export default function Home() {
  const simulations = []
  const [imovel,setImovel] = useState('')
  const [financiamento,setFinanciamento] = useState('')
  const [entrada,setEntrada] = useState('')
  const [prazo,setPrazo] = useState('')
  const [juros,setJuros] = useState('6%')
  const [simul , setSimul] = useState([])

  function createSimulation(ev){
  ev.preventDefault()
  for(let i = 1; i<Number(prazo); i++){
    const simulation = {
      parcelas : `Parcela ${i}`,
      valorParcela : (Number(imovel) - Number(entrada)) / prazo,
      juros: '0,48',
      financiado: financiamento,
    }
  simulations.push(simulation)
  setSimul(state => [simulation,...state])
  }
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
      <button onClick={SimulationPDF(simul)}>Gerar pdf</button>
    </main>
    </>
  )
}
