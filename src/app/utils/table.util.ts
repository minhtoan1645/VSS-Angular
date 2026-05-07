import { ALL_OPTION_LABEL } from '../constants/app.constants';
import { PaginationState } from '../models/pagination.model';

export interface PaginatedItems<T> {
  items: T[];
  pagination: PaginationState;
}

export function buildOptions(values: string[], allLabel = ALL_OPTION_LABEL): string[] {
  return [allLabel, ...Array.from(new Set(values))];
}

export function buildYearOptions(dates: string[], allLabel = ALL_OPTION_LABEL): string[] {
  return buildOptions(
    dates
      .map((date) => date.split('/')[2])
      .filter((year): year is string => Boolean(year)),
    allLabel
  );
}

export function paginateItems<T>(items: T[], currentPage: number, pageSize: number): PaginatedItems<T> {
  const totalItems = items.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
  const safePage = Math.min(currentPage, totalPages);
  const startIndex = (safePage - 1) * pageSize;

  return {
    items: items.slice(startIndex, startIndex + pageSize),
    pagination: {
      currentPage: safePage,
      pageSize,
      totalItems,
      totalPages
    }
  };
}
