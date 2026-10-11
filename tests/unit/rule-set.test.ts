import { describe, it, expect } from 'vitest';
import { RuleSet } from '../../src/lib/rule-set.js';

interface Rule {
    pattern: string;
    label: string;
}

function winner(rules: Rule[], input: string): string | undefined {
    const set = new RuleSet<Rule>((_current, next) => next);
    for (const rule of rules) {
        set.add(rule);
    }
    return set.apply(input)?.label;
}

describe('RuleSet.apply selection', () => {
    it('returns undefined when nothing matches', () => {
        expect(winner([{ pattern: 'git *', label: 'a' }], 'ls')).toBeUndefined();
    });

    it('returns the single matching rule', () => {
        expect(winner([{ pattern: 'git *', label: 'a' }], 'git add')).toBe('a');
    });

    it('dominance: a literal dominates a glob that matches it', () => {
        expect(
            winner(
                [
                    { pattern: 'git *', label: 'general' },
                    { pattern: 'git push', label: 'specific' }
                ],
                'git push'
            )
        ).toBe('specific');
    });

    it('dominance wins regardless of order', () => {
        expect(
            winner(
                [
                    { pattern: 'git push', label: 'specific' },
                    { pattern: 'git *', label: 'general' }
                ],
                'git push'
            )
        ).toBe('specific');
    });

    it('fewer wildcards wins when neither dominates', () => {
        expect(
            winner(
                [
                    { pattern: 'ls * *', label: 'two' },
                    { pattern: 'ls ?', label: 'one' }
                ],
                'ls a'
            )
        ).toBe('one');
    });

    it('more literal characters wins when wildcard counts tie', () => {
        expect(
            winner(
                [
                    { pattern: 'git p*', label: 'short' },
                    { pattern: 'git push *', label: 'long' }
                ],
                'git push main'
            )
        ).toBe('long');
    });

    it('first added wins on equal specificity', () => {
        expect(
            winner(
                [
                    { pattern: 'ls *', label: 'first' },
                    { pattern: 'ls *', label: 'second' }
                ],
                'ls -la'
            )
        ).toBe('first');
    });
});

describe('RuleSet.apply merge', () => {
    interface HeaderRule {
        pattern: string;
        headers: Record<string, string>;
    }

    it('merges matching rules from least to most specific', () => {
        const set = new RuleSet<HeaderRule>((current, next) => ({
            pattern: next.pattern,
            headers: { ...current.headers, ...next.headers }
        }));
        set.add({
            pattern: 'https://api.example.com/**',
            headers: { Accept: 'json', 'X-Common': 'general' }
        });
        set.add({
            pattern: 'https://api.example.com/v2/**',
            headers: { Authorization: 'Bearer x', 'X-Common': 'specific' }
        });

        expect(set.apply('https://api.example.com/v2/users')?.headers).toEqual({
            Accept: 'json',
            Authorization: 'Bearer x',
            'X-Common': 'specific'
        });
    });
});

describe('RuleSet.add and remove', () => {
    it('add chains and remove deletes every rule with the pattern', () => {
        const set = new RuleSet<Rule>((_current, next) => next);
        expect(set.add({ pattern: 'a', label: 'a' })).toBe(set);
        set.add({ pattern: 'b', label: 'b' });

        expect(set.remove('a')).toBe(true);
        expect(set.remove('a')).toBe(false);
        expect(set.apply('a')).toBeUndefined();
        expect(set.apply('b')?.label).toBe('b');
    });
});
