import { countLiterals, countWildcards, dominates } from './glob.js';

/** A rule that can be ordered by the specificity of its glob pattern. */
export interface PatternRule {
    /** Glob pattern matched against candidate strings. */
    pattern: string;
}

/**
 * Compare two glob patterns by specificity.
 *
 * Returns a negative number when `a` is more specific than `b`, a positive
 * number when `a` is less specific, and `0` when they are equally specific
 * (callers break such ties by insertion order).
 *
 * Criteria, applied in order:
 *
 * 1. **Dominance**: a literal pattern dominates a glob that matches it.
 * 2. **Wildcard count**: fewer `*`/`?` wins.
 * 3. **Literal count**: more literal characters wins.
 */
export function compareSpecificity(a: string, b: string): number {
    const aDominates = dominates(a, b);
    const bDominates = dominates(b, a);
    if (aDominates && !bDominates) return -1;
    if (!aDominates && bDominates) return 1;

    const aWildcards = countWildcards(a);
    const bWildcards = countWildcards(b);
    if (aWildcards !== bWildcards) return aWildcards - bWildcards;

    return countLiterals(b) - countLiterals(a);
}

/**
 * Sort rules from most specific to least specific.
 *
 * The sort is stable: rules with equally specific patterns keep their original
 * relative order.
 */
export function sortBySpecificity<T extends PatternRule>(rules: readonly T[]): T[] {
    return rules
        .map((rule, index) => ({ rule, index }))
        .sort((a, b) => {
            const bySpecificity = compareSpecificity(a.rule.pattern, b.rule.pattern);
            return bySpecificity !== 0 ? bySpecificity : a.index - b.index;
        })
        .map((entry) => entry.rule);
}
