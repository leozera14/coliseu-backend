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
      throw new Error("Username already exists, try a new one!");
    }

    const salt = await bcrypt.genSalt(10);

    const hash = await bcrypt.hash(password, salt);

    database.query(
      "INSERT INTO users(username, password) VALUES ($1, $2)",
      [username, hash],
      (err: any, results: any) => {
        if (err) {
          throw new Error(err);
        }

        res.status(200).json(`User ${username} added successfully!`);
      }
    );
  } catch (error: any) {
    throw new Error(error);
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
      throw new Error("User not found!");
    }

    bcrypt.compare(password, user.password, (err: any, results: any) => {
      if (err) {
        return res.status(400).json(err);
      }

      if (!results) {
        return res
          .status(400)
          .json("Incorrect username or password, try again later...");
      }

      return res
        .status(200)
        .json(`User ${username} successfully authenticated.`);
    });
  } catch (error: any) {
    throw new Error(error);
  }
};
