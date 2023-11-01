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

  function pesquisarProtocolo(ev){
    const protocoloLocal = JSON.parse(localStorage.getItem('processo'))
    if(protocoloLocal.protocolo === ev){
      errorMessage.current.innerText =  ''
      parcelasRef.current.innerText = `Numero de Parcelas: ${protocoloLocal.parcelas}`
      financiadoRef.current.innerText = `Financiado: R$ ${protocoloLocal.financiado},00`
      protocoloRef.current.innerText = `Numero de Protocolo: ${protocoloLocal.protocolo.replace(/\w{64}$/m,'...')}`
      cardRef.current.style.display = 'flex'
    }else{
      errorMessage.current.innerText =  'Processo não encontrado'
      parcelasRef.current.innerText = ''
      financiadoRef.current.innerText = ''
      protocoloRef.current.innerText = ''
      cardRef.current.style.display = 'none'

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