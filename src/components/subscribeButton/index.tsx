import { signIn, useSession } from "next-auth/react"
import styles from "./styles.module.scss"
import { api } from '../../services/api'
import { getStripeJs } from "../../services/stripe-js"

interface subscribeButtonProps {
    priceId: string;
}
export function SubscribeButton({ priceId }: subscribeButtonProps) {
    const { data: session } = useSession()

    async function SubscribeButton() {

        if (!session) {
            signIn('github')
            return
        }


        try {
            const response = await api.post('/subscribe')
            const { sessionId } = response.data
            const stripe = await getStripeJs()
            await stripe.redirectToCheckout({sessionId})
        } catch (err) {
            alert(err.message)
        }
    }

    return (
        <button
            onClick={SubscribeButton}
            type="button"
            className={styles.subscribeButton}>
            subscribe now
        </button>
    )
}