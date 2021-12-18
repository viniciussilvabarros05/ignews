import { NextApiRequest, NextApiResponse } from "next";
import { getSession } from "next-auth/react";
import { fauna } from "../../services/fauna";
import { stripe } from "../../services/stripe";
import { query as q } from "faunadb";

type User = {
    ref: {
        id: String
    }
    data: {
        stripe_customer_id: string
    }
}

//CRIANDO ROTA POST COM NEXT

export default async (req: NextApiRequest, res: NextApiResponse) => {

    if (req.method === 'POST') {
        const session = await getSession({ req }) //Função do next para buscar dados nos cookies 

        const user = await fauna.query<User>( // Recebendo tipagem User com o generic <>

            //Fazendo nova busca no banco de dados para saber se o usuario já é cliente
            q.Get(
                q.Match(
                    q.Index('user_by_email'),
                    q.Casefold(session.user.email)
                )
            )

        )

        let customerId = user.data.stripe_customer_id

        if (!customerId) {
            const striperCustomer = await stripe.customers.create({
                email: session.user.email,
                //metada
            })


            //Se já existir, fará um update do cliente
            await fauna.query(
                q.Update(
                    q.Ref(q.Collection('users'), user.ref.id),
                    {
                        data: {
                            stripe_customer_id: striperCustomer.id
                        }
                    }
                )
            )

            customerId = striperCustomer.id
        }




        //Caso não exista, criará um novo cliente

        const stripeCheckoutSession = await stripe.checkout.sessions.create({

            customer: customerId, // O customer nada mais é do que a identificação de quem está comprando o produto
            payment_method_types: ['card'], //Meios de pagamento
            billing_address_collection: 'required', //Se o endereço é obrigatório ou automatico
            line_items: [
                { price: "price_1K4FBwCYyFN2LcAxyCuqV4Ly", quantity: 1 } // Lista de produtos a serem adquiridos
            ],

            mode: 'subscription', //tipo de assinatura
            allow_promotion_codes: true, // Permitir cupons promcionais
            success_url: process.env.STRIPE_SUCCESS_URL, //rota
            cancel_url: process.env.STRIPE_CANCEL_URL //rota 
        })

        return res.status(200).json({ sessionId: stripeCheckoutSession.id })
    } else {
        res.setHeader('Allow', 'POST')
        res.status(405).end("Method not allowed") // Se a rota não for post, retornará um erro 405
    }
}