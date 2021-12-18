import Document, { Html, Head, Main, NextScript } from "next/document"

// O _document é como o index.html padrão quando se cria um projeto create-react-app

export default class MyDocument extends Document {
    render() {
        return (
            <Html>
                <Head>
                    <link rel="preconnect" href="https://fonts.gstatic.com" />
                    <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@600&family=Roboto:wght@400;700;900&display=swap" rel="stylesheet" />
                    <link rel="shortcut icon" href="/assets/images/favicon.png" type="image/png" />
                </Head>

                <body>
                    <Main />
                    <NextScript />
                </body>
            </Html>
        )
    }
}