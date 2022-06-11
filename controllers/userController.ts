import { Request, Response } from "express";
import { database } from "../database/connection";
import bcrypt from "bcrypt";
import { createToken } from "../utils/jwt";
import jwtConfig from "../config/jwt";
import { setCache } from "../utils/cache";

export const register = async (req: Request, res: Response) => {
  try {
    const { username, password } = req.body;

    const { rows } = await database.query(
      "SELECT * FROM users WHERE username = $1",
      [username]
    );

    if (rows[0]) {
      return res.status(400).json("Usuário ja existente, tente novamente!");
    }

    const salt = await bcrypt.genSalt(10);

    const hash = await bcrypt.hash(password, salt);

    database.query(
      "INSERT INTO users(username, password) VALUES ($1, $2)",
      [username, hash],
      (err: any, results: any) => {
        if (err) {
          return res.status(400).json(err);
        }

        res.status(200).json(`Usuário ${username} criado com sucesso!`);
      }
    );
  } catch (error: any) {
    return res.status(400).json(error);
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { username, password } = req.body;

    const { rows } = await database.query(
      "SELECT username, password FROM users WHERE username = $1",
      [username]
    );

    const user = rows[0];

    if (!user) {
      throw new Error("Usuário não encontrado!");
    }

    bcrypt.compare(password, user.password, async (err: any, results: any) => {
      if (err) {
        return res.status(401).json({error: 'Unauthorized!'});
      }

      if (!results) {
        return res
          .status(400)
          .json("Usuário ou senha incorretos, tente novamente...");
      }

      const token = createToken(String(user.id))

      return res
        .status(200)
        .json({
          user: user.username,
          access_token: token,
          expires_in: jwtConfig.ttl,
          token_type: 'Bearer'
        });
    });
  } catch (error: any) {
    return res.status(400).json(error);
  }
};

export const logout = async (req: Request, res: Response) => {
  try {
    const token = req.body.token

    const now = new Date();

    const expire = new Date(req.body.user.exp)

    const milliseconds = now.getTime() - expire.getTime()

    await setCache(token, token, milliseconds)

    return res.json({message: 'Logged out successfully!'})

  } catch (error) {
    return res.status(400).json(error)
  }
}
