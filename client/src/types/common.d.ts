declare namespace Common {
  type Breadcrumb = {
    path: string;
    text: string;
  };

  type Paging<T> = {
    data: Array<T>;
    totalRecord: number;
    totalPage: number;
    page: number;
    size: number;
  };
}
