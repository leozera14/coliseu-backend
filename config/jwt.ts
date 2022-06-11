import { IJwtConfig } from "../types/IJwtConfig";

const jwtConfig: IJwtConfig = {
  secret: process.env.JWT_SECRET as string,
  ttl: 3600
}

export default jwtConfig;