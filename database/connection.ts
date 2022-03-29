import { Pool } from "pg";

export const database = new Pool({
  user: "postgres",
  host: "localhost",
  database: "swing",
  password: "145974582",
  port: 5432,
});
