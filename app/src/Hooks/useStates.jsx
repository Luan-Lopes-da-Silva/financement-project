import { useState } from "react"

export default function useForm1(){
  const [imovel,setImovel] = useState('')
  const [despesas,setDespesas] = useState('')
  const [amortizacao,setAmortizacao] = useState('Selecione seu sistema de amortização')
  const [aniversario,setAniversario] = useState('') 
  const [banco,setBanco] = useState('Selecione um banco')
  const [financiamento,setFinanciamento] = useState('') 

  return {imovel,setImovel,despesas,setDespesas,amortizacao,setAmortizacao,aniversario,setAniversario,banco,setBanco,financiamento,setFinanciamento}

}