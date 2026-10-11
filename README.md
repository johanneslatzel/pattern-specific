# Pattern Specific

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![NPM](https://nodei.co/npm/@johannes.latzel/pattern-specific.svg?style=shields&data=n,v,u,d,s)](https://www.npmjs.com/package/@johannes.latzel/pattern-specific)
[![version](https://img.shields.io/github/package-json/v/johanneslatzel/pattern-specific)](https://github.com/johanneslatzel/pattern-specific/releases)
[![TypeScript](https://img.shields.io/badge/TypeScript-6.0-blue)](https://www.typescriptlang.org/)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen)](https://github.com/johanneslatzel/pattern-specific/pulls)
[![Feedback Welcome](https://img.shields.io/badge/feedback-welcome-brightgreen)](https://github.com/johanneslatzel/pattern-specific/discussions)
[![codecov](https://codecov.io/gh/johanneslatzel/pattern-specific/graph/badge.svg)](https://codecov.io/gh/johanneslatzel/pattern-specific)
[![CI](https://github.com/johanneslatzel/pattern-specific/actions/workflows/ci.yml/badge.svg)](https://github.com/johanneslatzel/pattern-specific/actions/workflows/ci.yml)
[![Socket Badge](https://badge.socket.dev/npm/package/@johannes.latzel/pattern-specific/latest)](https://badge.socket.dev/npm/package/@johannes.latzel/pattern-specific/latest)
[![AI Assisted Yes](https://img.shields.io/badge/AI%20Assisted-Yes-green)](https://github.com/mefengl/made-by-ai)

Resolve an input against a set of glob rules and merge the matching ones, with more specific rules overriding less specific ones. Used by [llm-chat-shell](https://github.com/johanneslatzel/llm-chat-shell) permissions and [llm-chat-web](https://github.com/johanneslatzel/llm-chat-web) header rules.

## Features

- a `RuleSet` that holds glob rules and applies the matching ones to an input
- most-specific-wins ordering: a literal dominates a glob that matches it, then fewer wildcards, then more literal characters, then insertion order
- caller-supplied merge, so rule payloads can be objects, decisions, or any other type
- ESM and TypeScript types, with picomatch as the only dependency

## Prerequisites

- Node.js >= 18

## Installation

```bash
npm install @johannes.latzel/pattern-specific
```

## Documentation

Full documentation at **[johanneslatzel.github.io/pattern-specific/](https://johanneslatzel.github.io/pattern-specific/)**

## License

MIT. See [`LICENSE`](LICENSE).

## Contributing

Issues and PRs welcome at [github.com/johanneslatzel/pattern-specific](https://github.com/johanneslatzel/pattern-specific).
