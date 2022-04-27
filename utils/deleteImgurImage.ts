import axios from "axios";
import { getImgurAuthorization } from "../services/authentication";

export const deleteImageFromImgur = async (hash: string) => {
  try {
    const token = await getImgurAuthorization();

    const { data } = await axios.delete(
      `https://api.imgur.com/3/image/${hash}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (data.success !== true && data.status !== 200) {
      return false
    } 

    return true;
  } catch (error) {
    return error;
  }
}