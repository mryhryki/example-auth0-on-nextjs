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

### Deploy by CLI

```shell
$ npm run auth0:import
```

### Application

#### ID Token

- ID Token Expiration: `120` seconds

#### Refresh Token Rotation

- Rotation: `ON`
- Reuse Interval: `1` seconds

#### Refresh Token Expiration

- Absolute Expiration: `ON`
- Absolute Lifetime: `900` seconds
- Inactivity Expiration: `ON`
- Inactivity Lifetime: `300` seconds

### API

#### Token Settings

- Token Expiration (Seconds): `90`

#### Access Settings

- Allow Offline Access: `ON`
