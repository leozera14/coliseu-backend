import { Request, Response } from "express";
import { database } from "../database/connection";
import bcrypt from "bcrypt";

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

    bcrypt.compare(password, user.password, (err: any, results: any) => {
      if (err) {
        return res.status(400).json(err);
      }

      if (!results) {
        return res
          .status(400)
          .json("Usuário ou senha incorretos, tente novamente...");
      }

      return res
        .status(200)
        .json(`Usuário ${username} autenticado com sucesso!`);
    });
  } catch (error: any) {
    return res.status(400).json(error);
  }
};
