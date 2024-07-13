declare namespace Common {
  type PagingQuery = {
    page?: string;
    size?: string;
  };

  type Paging<T> = {
    data: Array<T>;
    totalRecord: number;
    totalPage: number;
    page: number;
    size: number;
  };

  type Option = {
    label: string;
    value: string;
  };
}
