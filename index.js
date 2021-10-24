// 1. IMPORTACIONES
// IMPORTACIÓN DE LA LIBRERÍA DE EXPRESS
// REALIZAR NUESTRA GESTIÓN DE RUTAS
const express   = require("express")

// GENERAR VARIABLES DE ENTORNO
require("dotenv").config()

const stripe    = require("stripe")(process.env.STRIPE_KEY)
const app       = express()

const cors      = require("cors")

// 2. MIDDLEWARES
// FUNCIÓN QUE SE EJECUTA PREVIO A LAS RUTAS
app.use(express.json({extended: true}))

// FLEXBILIDAD EN EL MANEJO DE PETICIONES DEL CLIENTE AL SERVIDOR
app.use(cors())


// 3. RUTEO
app.get("/", async (request, response) => {

    // 1. ESTABLECER LOS IDS DE PRECIOS DE PRODUCTO DE STRIPE
    const productId = "price_1JnvrcCx3UrM12QhLxJceX9K"    

    // 2. GENERAR UNA SESIÓN
    // UNA SESIÓN ES UN MOMENTO EN EL CUAL STRIPE YA SABE QUE EL USUARIO QUIERE COMPRAR (CHECKOUT), POR LO TANTO VA A EMITIR LA INFORMACIÓN REQUERIDA PARA LA COMPRA.
    // ENTRE ESA INFO, ESTÁ LA URL DE COMPRA
    const session = await stripe.checkout.sessions.create({
        line_items: [
            { // 1. LÍNEA DE PRODUCTOS
                price: productId,
                quantity: 1
            }],
            payment_method_types:  [ // 2. MÉTODOS DE PAGO
                "card",
                "oxxo"
            ],
            mode: "payment", // 3. TIPO DE PAGO
            success_url: `http://localhost:3005/success`,
            cancel_url: `http://localhost:3005?cancelled=true`
    })

    response.json({
        stripe_info: session
    })

})


// 4. SERVIDOR
app.listen(process.env.PORT, () => {
    console.log("Servidor activo")
})