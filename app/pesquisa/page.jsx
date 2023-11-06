'use client'
import { useRef, useState } from 'react'
import style from './page.module.scss'

export default function Pesquisa(){
const [busca,setBusca] = useState() 
const parcelasRef = useRef()
const financiadoRef = useRef()
const protocoloRef = useRef()
const errorMessage = useRef()
const cardRef = useRef()

  async function pesquisarProtocolo(ev){
    const operations = await fetch("http://localhost:3000/operations").then((res)=>res.json());
    const matchOperation = operations.filter(operation => operation.protocoloAleatorio === ev)
    
    if(matchOperation.length === 0){
      cardRef.current.style.display = 'none'
      errorMessage.current.innerText = 'Numero de protocolo não encontrado'
    }
    else{
      cardRef.current.style.display = 'block'
      errorMessage.current.innerText = ''
      parcelasRef.current.innerText = `Parcelas: ${matchOperation[0].parcelas.length}`
      financiadoRef.current.innerText = `Financiado: ${matchOperation[0].financiamento}`
      protocoloRef.current.innerText = `Numero de protocolo: ${matchOperation[0].protocoloAleatorio.replace(/\w{66}$/m,'...')}`
    }
  }

  return(
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
      <form className={style.form}>
        <label htmlFor=""pesquisa>Pesquisar seu processo</label>
        <input 
        type="text" 
        name='pesquisa' 
        id='pesquisa'
        value={busca}
        onChange={(ev)=> pesquisarProtocolo(ev.currentTarget.value)}
        />
      </form>
      <p ref={errorMessage}></p>
      <div className={style.card} ref={cardRef}>
      <p ref={parcelasRef}></p>
      <p ref={financiadoRef}></p>
      <p ref={protocoloRef}></p>
      <button>Ver mais</button>
      </div>
    </main>
    </div>
  )
}