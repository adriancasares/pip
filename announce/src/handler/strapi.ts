import { Meeting } from "../lib/Meeting";
import axios from "redaxios";

export default function addToStrapi(meeting: Meeting) {
  return new Promise((resolve, reject) => {
    const url = "http://lasapip.herokuapp.com/api/meetings";

    const token = process.env.STRAPI_API_TOKEN;

    axios
      .post(
        url,
        {
          data: meeting,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then((res) => {
        resolve(res);
      })
      .catch((err) => {
        reject(err);
      });
  });
}
