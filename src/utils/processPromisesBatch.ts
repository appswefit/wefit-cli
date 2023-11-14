export async function processPromisesBatch<T>(
    items: Array<T>,
    limit: number,
    fn: (item: T) => Promise<any>,
  ): Promise<any> {
    let results: Array<any> = [];
    for (let start = 0; start < items.length; start += limit) {
      const end = start + limit > items.length ? items.length : start + limit;
  
      const slicedResults = await Promise.all(items.slice(start, end).map(fn));
  
      results = [
        ...results,
        ...slicedResults,
      ]
    }
  
    return results;
  }