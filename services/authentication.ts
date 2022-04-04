import axios from "axios";
import qs from "qs";

export const getAuthorization = async () => {
  try {
    const requestInfos = {
      refresh_token: `${process.env.IMGUR_REFRESH_TOKEN}`,
      client_id: `${process.env.IMGUR_CLIENT_ID}`,
      client_secret: `${process.env.IMGUR_CLIENT_SECRET}`,
      grant_type: `${process.env.IMGUR_GRANT_TYPE}`,
    };

    const options: any = {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      data: qs.stringify(requestInfos),
      url: "https://api.imgur.com/oauth2/token",
    };

    const { data } = await axios(options);

    return data.access_token;
  } catch (error) {
    return error;
  }
};
