# API Reference

## `RuleSet<T>`

Holds rules and applies the matching ones to an input. Matching rules are applied from least to most specific, so a more specific rule overrides a less specific one. Non-matching rules are ignored. `T` must carry a `pattern` field.

### `new RuleSet(merge)`

Create a rule set.

| Param | Type | Default | Description |
|---|---|---|---|
| `merge` | `(current: T, next: T) => T` |  | Combine the accumulated rule with a more specific rule; called from least to most specific |

### `add(rule)`

Add a rule. Rules with equal specificity keep insertion order.

| Param | Type | Default | Description |
|---|---|---|---|
| `rule` | `T` |  | Rule to add |

Returns the `RuleSet`, for chaining.

### `remove(pattern)`

Remove every rule with the given pattern.

| Param | Type | Default | Description |
|---|---|---|---|
| `pattern` | `string` |  | Exact pattern to remove |

Returns `boolean`, `true` when at least one rule was removed.

### `apply(input)`

Apply the matching rules to `input`.

| Param | Type | Default | Description |
|---|---|---|---|
| `input` | `string` |  | String matched against the rule patterns |

Returns the merged rule, or `undefined` when no rule matches.
