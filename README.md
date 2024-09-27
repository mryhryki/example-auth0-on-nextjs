# example-auth0-on-nextjs

- https://nextjs.org/docs
- https://auth0.com/docs/quickstart/webapp/nextjs

## Development

First, run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Auth0 Settings

### Prepare

Set environment variables:

```shell
export AUTH0_DOMAIN="(your auth0 domain)"
export AUTH0_CLIENT_ID="(your auth0 client id)"

export AUTH0_CLIENT_SECRET="(your auth0 client secret)"
# or AUTH0_CLIENT_SIGNING_KEY_PATH
# or AUTH0_ACCESS_TOKEN"
```

### Deploy by CLI

```shell
$ npm run auth0:deploy
```

### Download settings by CLI

```shell
$ npm run auth0:export
```
