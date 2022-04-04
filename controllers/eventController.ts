import axios from "axios";
import { Request, Response } from "express";
import { database } from "../database/connection";
import { getAuthorization } from "../services/authentication";

export const uploadImage = async (req: Request, res: Response) => {
  try {
    const token = await getAuthorization();

    const { buffer }: any = req?.file;

    const { data } = await axios.post("https://api.imgur.com/3/image", buffer, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return res.status(200).json(data.data);
  } catch (error: any) {
    console.log(error);

    return res.status(400).json(error);
  }
};
