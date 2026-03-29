# oikos-page

Frontend for browsing Oikos listings.

## Run

```bash
npm install
cp .env.example .env
npm run dev
```

For local development, requests to `/api` are proxied by Vite to `VITE_API_PROXY_TARGET`.
The default target is `http://localhost:8000`.

If you want to use the deployed API instead of a local backend, set:

```bash
VITE_API_PROXY_TARGET=https://oikos.netlsr.net
```
