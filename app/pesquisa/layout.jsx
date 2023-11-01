import Script from 'next/script'
import './globals.css'
import { Inter } from 'next/font/google'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Pesquisa'
}

export default function RootLayout({ children }) {
  return (
    <html lang="pt-br">
      <body className={inter.className}>{children}
      <Script src='https://cdn.lordicon.com/bhenfmcm.js'/>
      </body>
      
    </html>
  )
}
