import operations from '@/db.json'
export default function handler(req,res){
const {protocoloAleatorio} = req.query

const operation = operations.find(operation => operation.protocoloAleatorio === protocoloAleatorio)
res.status(200).json(operation)
}