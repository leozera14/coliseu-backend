import axios from "axios";
import { Request, Response } from "express";
import { database } from "../database/connection";
import { getImgurAuthorization } from "../services/authentication";

export const uploadImage = async (req: Request, res: Response) => {
  try {
    const token = await getImgurAuthorization();

    const { buffer }: any = req?.file;

    const { data } = await axios.post("https://api.imgur.com/3/image", buffer, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    database.query(
      "INSERT INTO images(imgur_id, delete_hash, imgur_link) VALUES ($1, $2, $3) RETURNING id",
      [data.data.id, data.data.deletehash, data.data.link],
      (err: any, results: any) => {
        if (err) {
          return res.status(400).json(err);
        }

        res.status(200).json({
          id: results.rows[0].id,
          image_hash: data.data.id,
          image_link: data.data.link,
        });
      }
    );
  } catch (error: any) {
    return res.status(400).json(error);
  }
};

export const deleteImage = async (req: Request, res: Response) => {
  try {
    const token = await getImgurAuthorization();

    const { hash } = req.params;

    const { data } = await axios.delete(
      `https://api.imgur.com/3/image/${hash}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (data.success === true && data.status === 200) {
      database.query(
        "DELETE FROM images WHERE imgur_id = $1",
        [hash],
        (err: any, results: any) => {
          if (err) {
            return res.status(400).json(err);
          }

          res.status(200).json({ message: "Imagem deletada com sucesso!" });
        }
      );
    }
  } catch (error) {
    return res.status(400).json(error);
  }
};
