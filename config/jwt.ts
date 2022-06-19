import { IJwtConfig } from "../types/IJwtConfig";

const jwtConfig: IJwtConfig = {
  secret: process.env.JWT_SECRET as string,
  ttl: '365d'
}

export default jwtConfig;