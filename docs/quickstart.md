# Quickstart

## Install

```bash
npm install @johannes.latzel/pattern-specific
```

## Basic usage

Create a `RuleSet` with a merge function, add rules, and apply an input. Matching rules are merged from least to most specific.

```ts
import { RuleSet } from '@johannes.latzel/pattern-specific';

const rules = new RuleSet<{ pattern: string; value: string }>((_current, next) => next);

rules.add({ pattern: 'git *', value: 'general' });
rules.add({ pattern: 'git push', value: 'specific' });

rules.apply('git push'); // { pattern: 'git push', value: 'specific' }
rules.apply('ls');       // undefined
```

The merge decides how rules combine. This example merges header objects, so a more specific rule overrides a header set by a less specific one:

```ts
const headers = new RuleSet<{ pattern: string; headers: Record<string, string> }>(
    (current, next) => ({
        pattern: next.pattern,
        headers: { ...current.headers, ...next.headers }
    })
);

headers.add({ pattern: 'https://api.example.com/**', headers: { Accept: 'application/json' } });
headers.add({ pattern: 'https://api.example.com/v2/**', headers: { Authorization: 'Bearer token' } });

headers.apply('https://api.example.com/v2/users')?.headers;
// { Accept: 'application/json', Authorization: 'Bearer token' }
```

## Full API

See [API Reference](api-reference.md).
