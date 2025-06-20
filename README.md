# Project Description

This project is a front-end application built with Nuxt 3, using Pinia for global state management and integration with a REST API for product management. The system simulates a virtual store, allowing product registration, editing, deletion, and listing, as well as a persistent shopping cart via localStorage.

# Installation and Running Steps

## 1. Install dependencies

Run the command for your package manager:

```bash
# npm
npm install
# yarn
yarn install
# pnpm
pnpm install
# bun
bun install
```

## 2. Run in development mode

```bash
# npm
npm run dev
# yarn
yarn dev
# pnpm
pnpm dev
# bun
bun run dev
```

Access: http://localhost:3000

## 3. Build for production

```bash
# npm
npm run build
# yarn
yarn build
# pnpm
pnpm build
# bun
bun run build
```

## 4. Preview the production build

```bash
# npm
npm run preview
# yarn
yarn preview
# pnpm
pnpm preview
# bun
bun run preview
```

# Technical Decisions Explanation

- **Nuxt 3**: Chosen for its productivity, SSR, and native integration with Vue 3.
- **Pinia**: Used for global state management of products and cart, making data reactive and persistent.
- **Cart Persistence**: The cart is saved in localStorage and synchronized in real time between tabs.
- **REST API**: All product operations (CRUD) are performed via API, centralized in the Pinia store for consistency and reactivity.
- **Componentization**: The project is divided into reusable components (Header, Body, Drawer, etc), making maintenance and scalability easier.
- **UI**: Modern UI components (UButton, UInput, UDrawer, etc) are used for a better user experience.

---

For more details, see the official [Nuxt documentation](https://nuxt.com/docs/getting-started/introduction).
