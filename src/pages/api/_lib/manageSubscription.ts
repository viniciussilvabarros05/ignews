import { query as q } from "faunadb"
import { fauna } from "../../../services/fauna"
import { stripe } from "../../../services/stripe"

export async function saveSubscription(
    subscriptionId: string,
    customerId: string,
    createAction = false,
) {
    const userRef = await fauna.query(
        q.Select( // Para selecionando apenas um campo no fauna, senão poderá acontecer do fauna ficar cobrando dados que não estão sendo usados
            'ref',
            q.Get(
                q.Match(
                    q.Index('user_by_customer_id_save'),
                    customerId
                )
            )
        )
    )

    const subscription = await stripe.subscriptions.retrieve(subscriptionId)

    const subscriptionData = {
        id: subscription.id,
        userId: userRef,
        status: subscription.status,
        price_id: subscription.items.data[0].price.id,

    }

    if (createAction) {
        await fauna.query(

            q.Create(
                q.Collection('subscriptions'),
                { data: subscriptionData }
            )
        )

    } else {
        await fauna.query(
            q.Replace( //Método para atualizar apenas um campo no faunaDB
                q.Select(
                    'ref',
                    q.Get(
                        q.Match(
                            q.Index('subcription_by_id'),
                            subscription.id
                        )
                    )
                ), 
                { data: subscriptionData }
            )
        )
    }



}