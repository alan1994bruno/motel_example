export type PageSort = {
  empty: boolean;
  sorted: boolean;
  unsorted: boolean;
};

export type Pageable = {
  offset: number;
  pageNumber: number;
  pageSize: number;
  paged: boolean;
  unpaged: boolean;
  sort: PageSort;
};

export type PageResponse<T> = {
  content: T[];

  empty: boolean;
  first: boolean;
  last: boolean;

  number: number;
  numberOfElements: number;

  pageable: Pageable;

  size: number;
  sort: PageSort;

  totalElements: number;
  totalPages: number;
};
