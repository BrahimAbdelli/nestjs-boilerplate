export class SearchResponse<T> {
  count: number;
  page?: number;
  totalPages?: number;
  data: T[];
}
