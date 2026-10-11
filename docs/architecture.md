# Architecture

## Overview

`@johannes.latzel/pattern-specific` resolves an input against a set of glob rules. It filters the rules that match, orders them by specificity, and folds them into a single result with a caller-supplied merge.

## Matching

Rules match through `picomatch`. A rule applies when its `pattern` matches the input; non-matching rules contribute nothing.

## Specificity

Matching rules are ordered from most to least specific by these criteria, applied in order:

1. **Dominance**: a literal pattern dominates a glob that matches it. Only applies when the literal has no wildcards.
2. **Wildcard count**: fewer `*`/`?` wins.
3. **Literal count**: more non-wildcard characters wins.
4. Equal patterns keep insertion order.

## Merge

The matching rules are folded from least to most specific with the `merge` function passed to the constructor, so a more specific rule overrides a less specific one. A single matching rule is returned as-is, and `apply` returns `undefined` when no rule matches.
