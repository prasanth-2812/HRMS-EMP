declare module 'xlsx' {
  export namespace utils {
    function book_new(): any;
    function book_append_sheet(wb: any, ws: any, name: string): void;
    function aoa_to_sheet(data: any[][]): any;
  }
  
  export function writeFile(wb: any, filename: string): void;
}
