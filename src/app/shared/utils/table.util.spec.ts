import { buildOptions, buildYearOptions, paginateItems } from './table.util';
import { ALL_OPTION_LABEL } from '../../core/constants/app.constants';

describe('table.util', () => {
  describe('buildOptions', () => {
    it('prepends allLabel to the list', () => {
      const result = buildOptions(['A', 'B']);
      expect(result[0]).toBe(ALL_OPTION_LABEL);
      expect(result).toContain('A');
      expect(result).toContain('B');
    });

    it('deduplicates values', () => {
      const result = buildOptions(['X', 'X', 'Y']);
      expect(result.filter(v => v === 'X').length).toBe(1);
    });

    it('accepts a custom allLabel', () => {
      const result = buildOptions(['A'], 'All');
      expect(result[0]).toBe('All');
    });

    it('returns just [allLabel] for empty input', () => {
      expect(buildOptions([])).toEqual([ALL_OPTION_LABEL]);
    });
  });

  describe('buildYearOptions', () => {
    it('extracts year from dd/mm/yyyy dates', () => {
      const result = buildYearOptions(['01/01/2023', '15/06/2024']);
      expect(result).toContain('2023');
      expect(result).toContain('2024');
    });

    it('deduplicates years', () => {
      const result = buildYearOptions(['01/01/2023', '10/03/2023']);
      expect(result.filter(v => v === '2023').length).toBe(1);
    });

    it('filters out dates with no third segment', () => {
      const result = buildYearOptions(['invalid', '01/2023']);
      expect(result).toEqual([ALL_OPTION_LABEL]);
    });

    it('prepends allLabel', () => {
      const result = buildYearOptions(['01/01/2023']);
      expect(result[0]).toBe(ALL_OPTION_LABEL);
    });
  });

  describe('paginateItems', () => {
    const items = Array.from({ length: 25 }, (_, i) => i + 1);

    it('returns first page items', () => {
      const result = paginateItems(items, 1, 10);
      expect(result.items).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
      expect(result.pagination.currentPage).toBe(1);
      expect(result.pagination.totalItems).toBe(25);
      expect(result.pagination.totalPages).toBe(3);
    });

    it('returns last page (partial)', () => {
      const result = paginateItems(items, 3, 10);
      expect(result.items).toEqual([21, 22, 23, 24, 25]);
    });

    it('clamps currentPage to totalPages when out of range', () => {
      const result = paginateItems(items, 99, 10);
      expect(result.pagination.currentPage).toBe(3);
    });

    it('returns totalPages = 1 for empty list', () => {
      const result = paginateItems([], 1, 10);
      expect(result.items).toEqual([]);
      expect(result.pagination.totalPages).toBe(1);
      expect(result.pagination.totalItems).toBe(0);
    });

    it('preserves pageSize in pagination state', () => {
      const result = paginateItems(items, 2, 5);
      expect(result.pagination.pageSize).toBe(5);
      expect(result.items.length).toBe(5);
    });
  });
});
