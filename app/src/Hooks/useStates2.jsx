import { useState } from "react";

export default function useForm2(){
const [entrada,setEntrada] = useState('')
const [prazo,setPrazo] = useState('')
const [juros,setJuros] = useState('')
const [active,setActive] = useState('')
const [primeiraParcela,setPrimeiraParcela] = useState('')  
const [ultimaParcela,setUltimaParcela] = useState('')  

return{entrada,setEntrada,prazo,setPrazo,juros,setJuros,active,setActive,primeiraParcela,setPrimeiraParcela,ultimaParcela,setUltimaParcela}
}