import { Request, Response } from "express";
import { database } from "../database/connection";
import { deleteImageFromImgur } from "../utils/deleteImgurImage";

export const getEnvironmentsList = (req: Request, res: Response) => {
  try {
    database.query(
      "SELECT a.id, a.title, b.imgur_link FROM environments a INNER JOIN images b ON b.environment_id = a.id",
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

export const getEnvironmentById = (req: Request, res: Response) => {
  try {
    const {id} = req.params
  
    database.query('SELECT a.title, b.imgur_id, b.imgur_delete_hash, b.imgur_link FROM environments a INNER JOIN images b ON a.id = b.environment_id WHERE a.id = $1', 
    [id], 
    (err, results) => {
      if(err) {
        return res.status(400).json(err);
      }

      if(!results.rows[0]) {
        return res.status(404).json({message: 'Ambiente não encontrado!'})
      }

      return res.status(200).json(results.rows[0])
    })
  } catch (error) {
    return res.status(400).json(error)
  }
}

export const createEnvironment = async (req: Request, res: Response) => {
  try {
    const { title, image_hash, image_delete_hash, image_link } = req.body;

    database.query(
      "INSERT INTO environments(title) VALUES ($1) RETURNING id",
      [title], async (err: any, results: any) => {
        if(err) {
          return res.status(400).json(err)
        }

        const environmentId = results.rows[0].id

        const image = await database.query("INSERT INTO images(imgur_id, imgur_delete_hash, imgur_link, environment_id) VALUES ($1, $2, $3, $4) RETURNING id", 
        [image_hash, image_delete_hash, image_link, environmentId])

        if(!err && image) {
          return res.status(200).json({ message: `Ambiente ${title} criado com sucesso!` })
        }
      })
  } catch (error) {
    return res.status(400).json(error);
  }
};

export const updateEnvironmentById = async(req: Request, res: Response) => {
  try {
    const {id} = req.params
    const { title, image_hash, image_delete_hash, image_link } = req.body;
    
    database.query(
      "UPDATE environments SET title = $1 WHERE id = $2",
      [title, id],
      async (err: any, results: any) => {
        if(err) {
          return res.status(400).json(err)
        }

        const {rowCount: environmentRowUpdate} = results

        if(environmentRowUpdate >= 1) {
          const {rowCount: imageRowUpdate} = await database.query("UPDATE images SET imgur_id = $1, imgur_delete_hash = $2, imgur_link = $3 WHERE environment_id = $4",
          [image_hash, image_delete_hash, image_link, id])
  
          if(!err && imageRowUpdate >= 1) {
            return res.status(200).json({message: "Ambiente atualizado com sucesso!"})
          }
        }
      }
    )
  } catch (error) {
    return res.status(400).json(error);
  }
}

export const deleteEnvironment = async (req: Request, res: Response) => {
  try {
    const {id} = req.params

    database.query('SELECT a.imgur_id FROM images a INNER JOIN environments b ON a.environment_id = b.id WHERE b.id = $1', [id], async (err: any, results:any) => {
      if (err) {
        return res.status(400).json(err);
      }

      const imgurImageHash = results.rows[0]

      const deleteImageConfirmed = await deleteImageFromImgur(imgurImageHash);

      if(deleteImageConfirmed) {
        database.query("DELETE FROM environments WHERE id = $1", [id], (err: any, results: any) => {
          if (err) {
            return res.status(400).json(err);
          }
    
          return res.status(200).json({
            success: true,
            message: 'Ambiente deletado com sucesso!'
          })
          
        });
      }
    })
  } catch (error) {
    return res.status(400).json(error);
  }
}


