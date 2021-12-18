import { GetStaticProps } from 'next'

import Head from 'next/head'

import { SubscribeButton } from '../components/subscribeButton'
import { stripe } from '../services/stripe'
import styles from "./home.module.scss"

interface HomeProps {
  product: {
    priceId: string;
    amount: number;
  }

}

export default function Home({ product }: HomeProps) {
  return (
    <>
      <Head>
        <title>Inicio | Ig.news</title>
      </Head>

      <main className={styles.contentContainer}>
        <section className={styles.hero}>
          <span>
            👏 Hey, welcome
          </span>
          <h1>
            News about the <span>React</span>  world.
          </h1>

          <p>
            Get acess to all the publications <br />
            <span>for {product.amount} month</span>
          </p>
          <SubscribeButton priceId={product.priceId} />
        </section>

        <img src='/assets/images/avatar.svg' alt="girl coding"></img>
      </main>
    </>

  )
}
// o nome da constante tem que ser estritamente getServerSideProps! e async 
// Também existe o getStaticProps para salvar o html, tornando mais perfomatico e não sendo necessário ter uma nova renderização dos elementos html

export const getStaticProps: GetStaticProps = async () => {
  const price = await stripe.prices.retrieve('price_1K4FBwCYyFN2LcAxyCuqV4Ly', { //passando id do produto
    expand: ['product']  // pegando todas as informações do produto
  })

  const product = {
    priceId: price.id,
    amount: new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(price.unit_amount / 100), //salvando preço em centavos para ajustar na formatação
  }
  return {
    props: {
      product,
    },
    revalidate: 60 * 60 * 24, // 24 horas
  }
}