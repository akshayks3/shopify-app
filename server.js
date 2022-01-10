require('isomorphic-fetch');
const dotenv = require('dotenv')
const Koa = require('koa')
const next = require('next')
const { default: createShopifyAuth } = require('@shopify/koa-shopify-auth');
const { verifyRequest } = require('@shopify/koa-shopify-auth')
const session = require('koa-session');

const Router = require('@koa/router');
const axios = require('axios')

dotenv.config();

const port = process.env.PORT || 3000;
const dev = process.env.NODE_ENV !== 'production'
const app = next({ dev });
const handle = app.getRequestHandler()
const SHOPIFY_API_SECRET_KEY = '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'
const SHOPIFY_API_KEY = 'f0d738cf6f7644e3a99ec0507b03662d'

app.prepare().then(() => {
    const server = new Koa();
    const router = new Router();
    server.use(session({ secure: true, sameSite: 'none' }, server))
    server.keys = [SHOPIFY_API_SECRET_KEY];

    server.use(createShopifyAuth({
        apiKey: SHOPIFY_API_KEY,
        secret: SHOPIFY_API_SECRET_KEY,
        scopes: ['read_products'],
        async afterAuth(ctx) {
            const { shop, accessToken } = ctx.session;
            console.log(shop, 'shop')
            ctx.redirect('/')
        }
    }))

    server.use(verifyRequest())

    router.get('/getProducts', verifyRequest(), async (ctx, res) => {
        const { shop, accessToken } = ctx.session
        const url = `https://${shop}/admin/api/2020-10/products.json`
        const shopifyHeader = (token) => ({
            'Content-Type': 'application/json',
            'X-Shopify-Access-Token': token
        })
        const getProducts = await axios.get(url, { headers: shopifyHeader(accessToken) })
        ctx.body = getProducts.data;
        ctx.res.statusCode = 200;
    })



    server.use(router.routes());
    server.use(router.allowedMethods());

    server.use(async (ctx) => {
        await handle(ctx.req, ctx.res)
        ctx.respond = false;
        ctx.res.statusCode = 200;
        return;
    })

    server.listen(port, () => {
        console.log(`> Ready on http://localhost:${port}`)
    })
})