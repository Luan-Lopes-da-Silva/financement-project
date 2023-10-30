import pdfMake from 'pdfmake/build/pdfmake'
import pdfFonts from 'pdfmake/build/vfs_fonts'

export default function SimulationsPDF(simulations){
  pdfMake.vfs = pdfFonts.pdfMake.vfs

  const reportTitle = [
    {
      text: 'Simulação',
      fontSize:15,
      bold: true,
      margin: [15,20,0,45]
    }
  ]

  const dados =  simulations.map((simulation)=>{
    return[
      {text: simulation.parcelas,  fontSize:10},
      {text: simulation.juros,  fontSize:10},
      {text: simulation.amortizacao,  fontSize:10},
      {text: simulation.valorParcela,  fontSize:10},
      {text: simulation.saldoDevedor,  fontSize:10}
    ]
  })

  const details = [
    {
      table:{
          headerRows:1,
          widths: ['*','*','*','*','*'],
          body:[
            [
              {text: 'Parcela (P)', style:'tableHeader', fontSize:10},
              {text: 'Juros (S)', style:'tableHeader', fontSize:10},
              {text: 'Amortização (A)', style:'tableHeader', fontSize:10},
              {text: 'Valor Parcela (VP)', style:'tableHeader', fontSize:10},
              {text: 'Saldo Devedor (SD)', style:'tableHeader', fontSize:10}
            ],
            [
              {text: 'Parcela 0', fontSize:10},
              {text: '0',fontSize:10},
              {text: `0`,fontSize:10},
              {text: '0',fontSize:10},
              {text: `${simulations[0].financiado}`,fontSize:10}
            ],
           ...dados
        ]
      },
      layout: 'hearderLineOnly'
    }
  ]

  function Footer(currentPage, pageCount){
    return [
      {
        text: currentPage + ' / ' +  pageCount,
        alignment: 'center',
        fontSize: 9,
        margin: [0,10,20,0]
      }
    ]
  }

  const docDefinitions = {
    pageSize: 'A4',
    pageMargins: [15,50,15,40],

    header: [reportTitle],
    content: [details],
    footer: Footer
  }

  pdfMake.createPdf(docDefinitions).download();
}