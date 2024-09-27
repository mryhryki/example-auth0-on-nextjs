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

```shell
cp auth0-deploy-cli/config.json{.example,}
# And edit config.json
```

### Deploy by CLI

```shell
$ npm run auth0:deploy
```

### Download settings by CLI

```shell
$ npm run auth0:export
```
