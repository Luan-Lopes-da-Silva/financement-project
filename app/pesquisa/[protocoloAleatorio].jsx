import { fetchOperation } from "../services/operations"

export const getStaticProps = async (context) => {
const protocoloAleatorio = context.params?.protocoloAleatorio

if(typeof protocoloAleatorio === 'string'){
  const operation = await fetchOperation(protocoloAleatorio)

  return {props: {operation}, revalidate: 10}
}

return {redirect: {destination: '/pesquisa', permanent: false}}
}

export default function Operation(props){
  return(
  <div>
  <h1>{props.operation.parcelas.length}</h1>
  <h1>{props.operation.financiamento}</h1>
  <h1>{props.operation.protocoloAleatorio}</h1>
  </div>
  )
} 