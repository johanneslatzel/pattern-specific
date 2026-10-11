import { describe, it, expect } from 'vitest';
import { compareSpecificity, sortBySpecificity } from '../../src/lib/specificity.js';

interface Rule {
    pattern: string;
    action: string;
}

describe('compareSpecificity', () => {
    it('ranks a dominant literal as more specific', () => {
        expect(compareSpecificity('git push', 'git *')).toBeLessThan(0);
        expect(compareSpecificity('git *', 'git push')).toBeGreaterThan(0);
    });

    it('breaks ties by wildcard count', () => {
        expect(compareSpecificity('ls ?', 'ls * *')).toBeLessThan(0);
    });

    it('breaks ties by literal character count', () => {
        expect(compareSpecificity('git push *', 'git p*')).toBeLessThan(0);
    });

    it('returns 0 for equally specific patterns', () => {
        expect(compareSpecificity('ls *', 'ls *')).toBe(0);
        expect(compareSpecificity('git push', 'git push')).toBe(0);
    });
});

describe('sortBySpecificity', () => {
    it('orders most specific first', () => {
        const rules: Rule[] = [
            { pattern: 'git *', action: 'allow' },
            { pattern: 'git push origin main', action: 'deny' },
            { pattern: 'git push *', action: 'allow' }
        ];
        expect(sortBySpecificity(rules).map((rule) => rule.pattern)).toEqual([
            'git push origin main',
            'git push *',
            'git *'
        ]);
    });

    it('keeps declaration order for equally specific patterns', () => {
        const rules: Rule[] = [
            { pattern: 'ls *', action: 'deny' },
            { pattern: 'ls *', action: 'allow' }
        ];
        expect(sortBySpecificity(rules).map((rule) => rule.action)).toEqual(['deny', 'allow']);
    });

    it('does not mutate the input array', () => {
        const rules: Rule[] = [
            { pattern: 'git *', action: 'allow' },
            { pattern: 'git push', action: 'deny' }
        ];
        sortBySpecificity(rules);
        expect(rules[0]!.pattern).toBe('git *');
    });
});
