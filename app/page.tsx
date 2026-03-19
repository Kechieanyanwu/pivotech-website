import Nav from '@/components/Nav'
import Hero from '@/components/Hero'
import WhoThisIsFor from '@/components/WhoThisIsFor'
import WhatWeDo from '@/components/WhatWeDo'
import Thesis from '@/components/Thesis'
import Engage from '@/components/Engage'
import Footer from '@/components/Footer'

export default function Home() {
  return (
    <>
      <Nav />
      <main>
        <Hero />
        <WhoThisIsFor />
        <WhatWeDo />
        <Thesis />
        <Engage />
      </main>
      <Footer />
    </>
  )
}
