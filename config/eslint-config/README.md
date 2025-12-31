# @saas/eslint-config

Flat ESLint configs for a pnpm monorepo using ESLint 9.

Available configs:
- `@saas/eslint-config/node` — Node.js + TypeScript + Prettier
- `@saas/eslint-config/next` — Next.js + React + TypeScript + Prettier
- `@saas/eslint-config/javascript` — JavaScript + Prettier

## Usage
Create `eslint.config.js` in your app/package:

### Node (TypeScript)
```js
import nodeConfig from '@saas/eslint-config/node';
export default nodeConfig;
```

### Next.js (TypeScript)
```js
import nextConfig from '@saas/eslint-config/next';
export default nextConfig;
```

### JavaScript
```js
import jsConfig from '@saas/eslint-config/javascript';
export default jsConfig;
```

## Peer deps in consuming packages
Install in each app/package (or at workspace root):
```sh
pnpm add -D eslint@^9 typescript@^5
```

Run lint:
```sh
pnpm exec eslint .
```
