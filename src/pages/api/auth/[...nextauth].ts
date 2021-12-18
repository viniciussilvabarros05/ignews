import NextAuth from "next-auth"
import GithubProvider from "next-auth/providers/github"
import { fauna } from "../../../services/fauna"
import { query as q } from "faunadb"
export default NextAuth({

  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
      authorization: {
        params: {
          scope: 'read:user'
        }
      }
    }),

  ],

  callbacks: {
    async signIn({ user, account, profile }) {
      const { email } = user
      // Verificando se já existe esse email, caso não, irá criar um novo usuário
      // Não é possível buscar um dado sem um indice no fauna
      try {
        await fauna.query(

          q.If(
            q.Not(
              q.Exists(
                q.Match(
                  q.Index('user_by_email'), // Procurando email pelo indice
                  q.Casefold(user.email) // Retornando email em lowercase
                )
              )
            ),

            q.Create(
              q.Collection('users'), //Entrando na coleção users
              { data: { email } } // criando email 
            ),

            q.Get(
              q.Match(
                q.Index('user_by_email'),
                q.Casefold(user.email)
              ))

          )

        )

        return true
      } catch {
        return false
      }
    },
  }
})