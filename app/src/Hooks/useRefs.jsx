import { useRef } from "react";

export default function useRefs(){
  const refResumo = useRef()
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
  const inputRef = useRef()

  return{
  refResumo,mensage,mensageAmortizacao,mensageAniversario,mensageBanco,mensageDespesa,mensageEntrada,mensageJuros,mensageParcela,mensagePorcentagemFinanciamento,btnLimpar,btnRef,formRef,outputRef,inputRef  
  }
}