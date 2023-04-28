import "@/styles/globals.css"
import type { AppProps } from "next/app"
import { Nunito_Sans } from "next/font/google"

const nunito = Nunito_Sans({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-nunito",
})

export default function App({ Component, pageProps }: AppProps) {
  return (
    <main
      className={`${nunito.className} ${nunito.variable} flex h-screen w-screen flex-col items-center justify-center font-sans text-slate-900 antialiased`}
    >
      <Component {...pageProps} />
    </main>
  )
}
