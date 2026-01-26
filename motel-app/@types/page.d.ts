export interface PaginatedResponse<T> {
  content: T[];
  pageable: PageableInfo;
  last: boolean;
  totalPages: number;
  totalElements: number;
  size: number;
  number: number;
  sort: SortInfo;
  first: boolean;
  numberOfElements: number;
  empty: boolean;
}

export type ReservationApiResponse = PaginatedResponse<ReservationItem>;
