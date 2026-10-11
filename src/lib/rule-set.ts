import { matchesPattern } from './glob.js';
import { sortBySpecificity } from './specificity.js';

/**
 * Holds rules and applies the matching ones to an input.
 *
 * The rules whose pattern matches the input are applied from least to most
 * specific, so a more specific rule overrides a less specific one. Non-matching
 * rules are ignored.
 *
 * @typeParam T - The rule type. It must carry the glob `pattern` field.
 */
export class RuleSet<T extends { pattern: string }> {
    private readonly rules: T[] = [];
    private readonly merge: (current: T, next: T) => T;

    /**
     * @param merge Combine the accumulated rule with a more specific rule.
     *              Called from least to most specific.
     */
    constructor(merge: (current: T, next: T) => T) {
        this.merge = merge;
    }

    /**
     * Add a rule. Rules with equal specificity keep insertion order.
     *
     * @param rule The rule to add.
     * @returns This instance, for chaining.
     */
    add(rule: T): this {
        this.rules.push(rule);
        return this;
    }

    /**
     * Remove every rule with the given pattern.
     *
     * @param pattern The exact pattern to remove.
     * @returns `true` when at least one rule was removed.
     */
    remove(pattern: string): boolean {
        const before = this.rules.length;
        const kept = this.rules.filter((rule) => rule.pattern !== pattern);
        this.rules.length = 0;
        this.rules.push(...kept);
        return kept.length !== before;
    }

    /**
     * Apply the matching rules to `input`.
     *
     * @param input The string matched against the rule patterns.
     * @returns The merged rule, or `undefined` when no rule matches.
     */
    apply(input: string): T | undefined {
        const matching = this.rules.filter((rule) => matchesPattern(input, rule.pattern));
        if (matching.length === 0) {
            return undefined;
        }
        return sortBySpecificity(matching).reduceRight((merged, rule) => this.merge(merged, rule));
    }
}
