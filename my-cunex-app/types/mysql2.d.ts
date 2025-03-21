// filepath: /Users/pannawish/CUNEX_Hack/CUNEX-Hackathon-2/my-cunex-app/types/mysql2.d.ts
declare module 'mysql2/promise' {
  import * as mysql from 'mysql2';
  export * from 'mysql2';
  export { Connection, Pool, PoolConnection } from 'mysql2/typings/mysql';
}