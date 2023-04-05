// Adapted from https://github.com/Taofiqq/nextjs-paginate/blob/main/src/helpers/paginate.js

export const paginate = (items: string | any[], pageNumber: number, pageSize: number) => {
    const startIndex = (pageNumber - 1) * pageSize;
    return items.slice(startIndex, startIndex + pageSize); // 0, 9
  };