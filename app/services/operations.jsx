export const fetchOperation =  async (protocoloAleatorio) => {
const operation = await fetch (`${process.env.NEXT_PUBLIC_APIURL}/api/pesquisa/${protocoloAleatorio}`).then(res => res.json())
return operation
}