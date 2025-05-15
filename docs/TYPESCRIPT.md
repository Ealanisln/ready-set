# TypeScript Best Practices

This document describes our TypeScript configuration and best practices for preventing type errors, especially in production builds.

## Prisma Transactions

When using Prisma transactions, always provide explicit typing for the transaction parameter:

```typescript
import { PrismaTransaction } from '@/types/prisma-types';
import { prisma } from '@/lib/prisma';

async function exampleFunction() {
  return await prisma.$transaction(async (tx: PrismaTransaction) => {
    // Your transaction code here using the properly typed 'tx'
    const user = await tx.profile.findUnique({ where: { id: '123' } });
    return user;
  });
}
```

## Type Checking

We have multiple layers of type checking in our workflow:

1. **Local Development**: 
   - Run `pnpm typecheck` before committing changes
   - Use VS Code and its TypeScript integration

2. **CI/CD Pipeline**:
   - Pre-push hooks run type checking automatically
   - GitHub Actions verify types on PRs and branch pushes
   - Build process includes type checking

3. **Production Deployment**:
   - Vercel build includes type checking
   - Use the same TypeScript version locally and in CI/CD

## Common TypeScript Errors and Solutions

### 1. Parameter implicitly has 'any' type

```typescript
// ❌ Bad - parameter has implicit 'any' type
function process(data) {
  return data.id;
}

// ✅ Good - parameter has explicit type
function process(data: { id: string }) {
  return data.id;
}
```

### 2. Prisma Transaction Typing

```typescript
// ❌ Bad - transaction parameter has implicit 'any' type
await prisma.$transaction(async (tx) => {
  await tx.user.findMany();
});

// ✅ Good - transaction parameter is properly typed
import { PrismaTransaction } from '@/types/prisma-types';
await prisma.$transaction(async (tx: PrismaTransaction) => {
  await tx.user.findMany();
});
```

### 3. Nullable Properties

```typescript
// ❌ Bad - doesn't handle null/undefined
function getName(user: { name?: string }) {
  return user.name.toUpperCase(); // Error: Object is possibly undefined
}

// ✅ Good - handles null/undefined
function getName(user: { name?: string }) {
  return user.name?.toUpperCase() ?? 'UNKNOWN';
}
```

## TypeScript Configuration

Our `tsconfig.json` has strict settings enabled:
- `noImplicitAny`: true
- `strictNullChecks`: true
- `strictFunctionTypes`: true
- `noUncheckedIndexedAccess`: true

See the root `tsconfig.json` for all settings.

## Resources

- [TypeScript Documentation](https://www.typescriptlang.org/docs/)
- [Prisma TypeScript Guidelines](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/typescript)
- Example code: `src/templates/prisma-transaction.ts` 