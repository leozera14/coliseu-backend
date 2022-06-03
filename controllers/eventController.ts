import { Request, Response } from "express";
import { database } from "../database/connection";
import { deleteImageFromImgur } from "../utils/deleteImgurImage";

export const getEventsList = (req: Request, res: Response) => {
  try {
    database.query(
      "SELECT a.id, a.title, a.description, b.imgur_link FROM events a INNER JOIN images b ON b.event_id = a.id",
      (err: any, results: any) => {
        if (err) {
          return res.status(400).json(err);
        }

        return res.status(200).json(results.rows);
      }
    );
  } catch (error) {
    return res.status(400).json(error);
  }
};

export const getEventById = (req: Request, res: Response) => {
  try {
    const {id} = req.params

    database.query('SELECT  a.title, a.description, b.imgur_id, b.imgur_delete_hash, b.imgur_link FROM events a INNER JOIN images b ON a.id = b.event_id WHERE a.id = $1', 
    [id], 
    (err, results) => {
      if(err) {
        return res.status(400).json(err);
      }

      if(!results.rows[0]) {
        return res.status(404).json({message: 'Evento não encontrado!'})
      }

      return res.status(200).json(results.rows[0])
    })
  } catch (error) {
    return res.status(400).json(error)
  }
}

export const createEvent = async (req: Request, res: Response) => {
  try {
    const { title, description, image_hash, image_delete_hash, image_link } = req.body;

    database.query(
      "INSERT INTO events(title, description) VALUES ($1, $2) RETURNING id",
      [title, description], async (err: any, results: any) => {
        if(err) {
          return res.status(400).json(err)
        }

        const eventId = results.rows[0].id

        const image = await database.query("INSERT INTO images(imgur_id, imgur_delete_hash, imgur_link, event_id) VALUES ($1, $2, $3, $4) RETURNING id", 
        [image_hash, image_delete_hash, image_link, eventId])

        if(!err && image) {
          return res.status(200).json({ message: `Evento ${title} criado com sucesso!` })
        }
      })
  } catch (error) {
    return res.status(400).json(error);
  }
};

export const updateEventById = async(req: Request, res: Response) => {
  try {
    const {id} = req.params
    const { title, description, image_hash, image_delete_hash, image_link } = req.body;
    
    database.query(
      "UPDATE events SET title = $1, description = $2 WHERE id = $3",
      [title, description, id],
      async (err: any, results: any) => {
        if(err) {
          return res.status(400).json(err)
        }

        const {rowCount: eventRowUpdate} = results

        if(eventRowUpdate >= 1) {
          const {rowCount: imageRowUpdate} = await database.query("UPDATE images SET imgur_id = $1, imgur_delete_hash = $2, imgur_link = $3 WHERE event_id = $4",
          [image_hash, image_delete_hash, image_link, id])
  
          if(!err && imageRowUpdate >= 1) {
            return res.status(200).json({message: "Evento atualizado com sucesso!"})
          }
        }
      }
    )
  } catch (error) {
    return res.status(400).json(error);
  }
}

export const deleteEvent = async (req: Request, res: Response) => {
  try {
    const {id} = req.params

    database.query('SELECT a.imgur_id FROM images a INNER JOIN events b ON a.event_id = b.id WHERE b.id = $1', [id], async (err: any, results:any) => {
      if (err) {
        return res.status(400).json(err);
      }

      const imgurImageHash = results.rows[0]

      const deleteImageConfirmed = await deleteImageFromImgur(imgurImageHash);

      if(deleteImageConfirmed) {
        database.query("DELETE FROM events WHERE id = $1", [id], (err: any, results: any) => {
          if (err) {
            return res.status(400).json(err);
          }
    
          return res.status(200).json({
            success: true,
            message: 'Evento deletado com sucesso!'
          })
          
        });
      }
    })
  } catch (error) {
    return res.status(400).json(error);
  }
}


