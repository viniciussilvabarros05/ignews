import { loadStripe } from '@stripe/stripe-js'

 const publicKey = `${process.env.NEXT_PUPLIC_STRIPE_PUBLIC_KEY}`
export async function getStripeJs(){
    //Usando a chave publica do stripe para chamar o sdk
    const stripeJs = await loadStripe("pk_test_51K4FATCYyFN2LcAxnfQhcsaZdAYSkwbW7tdf70diVL3fh5H5OlQydynCfpTMDIEqo4Jc7NFvSkcvpSQhp1ABkakj005CsnsfUK")
    return stripeJs
}

