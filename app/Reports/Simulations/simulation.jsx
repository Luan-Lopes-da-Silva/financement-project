import pdfMake from 'pdfmake/build/pdfmake'
import pdfFonts from 'pdfmake/build/vfs_fonts'

export default function SimulationPDF(simulations){
  pdfMake.vfs = pdfFonts.pdfMake.vfs;

  const reportTitle = [
    {
      text: 'Simulação',
      fontSize: 15,
      bold: true,
      margin: [15,20,0,45] //left, top, right, bottom
    }
  ]
  const datas = simulations.map((simulation)=>{
    return  [
      {text: simulation.parcelas, fontSize:9, alignment:'center'},
      {text: simulation.valorParcela, fontSize:9 , alignment:'center'},
      {text: simulation.juros, fontSize:9 , alignment:'center'},
      {text: simulation.financiado, fontSize:9, alignment:'center'},
    ]
  })
  
  const details = [
    {
      table:{
        headerRows:1,
        widths: ['*','*','*','*','*'],
        body:[
          [
            {text: 'Parcelas', style: 'tableHeader', fontSize:10},
            {text: 'Valor parcela', style: 'tableHeader', fontSize:10},
            {text: 'Juros', style: 'tableHeader', fontSize:10},
            {text: 'Valor financiado', style: 'tableHeader', fontSize:10},
          ],
          [
            {text: 'Heber', fontSize:9, alignment:'center'},
            {text: 'Heber', fontSize:9 , alignment:'center'},
            {text: 'Heber', fontSize:9 , alignment:'center'},
            {text: 'Heber', fontSize:9, alignment:'center'}
          ],
          ...datas
        ]
      },
      layout: {
				hLineWidth: function (i, node) {
					return (i === 0 || i === node.table.body.length) ? 2 : 1;
				},
				vLineWidth: function (i, node) {
					return (i === 0 || i === node.table.widths.length) ? 2 : 1;
				},
				hLineColor: function (i, node) {
					return (i === 0 || i === node.table.body.length) ? 'black' : 'gray';
				},
				vLineColor: function (i, node) {
					return (i === 0 || i === node.table.widths.length) ? 'black' : 'gray';
				}
    }
  }
  ]

  function Rodape(currentPage, pageCount){
    return [
      {
        text: currentPage +  ' / ' + pageCount,
        alignment: 'center', 
        fontSize: 9,
        margin: [0,10,20,0] //left, top, right, bottom
      }
    ]
  }

  const docDefinitions = {
    pageSize: 'A4',
    pageMargins: [15,50,15,40],

    header: [reportTitle],
    content:[details],
    footer: Rodape
  }

  pdfMake.createPdf(docDefinitions).download();
}