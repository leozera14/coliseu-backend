import { Request, Response } from "express";
import { database } from "../database/connection";

export const createEvent = (req: Request, res: Response) => {
  try {
    const { title, description, image_id } = req.body;

    database.query(
      "INSERT INTO events(title, description, image_id) VALUES ($1, $2, $3)",
      [title, description, image_id],
      (err: any, results: any) => {
        if (err) {
          console.log(err);
          return res.status(400).json(err);
        }

        res.status(200).json(`Evento ${title} criado com sucesso!`);
      }
    );
  } catch (error) {
    return res.status(400).json(error);
  }
};
