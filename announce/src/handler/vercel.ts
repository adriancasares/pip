import { Meeting } from "../lib/Meeting";
import axios from "redaxios";

export default function deployToVercel(meeting: Meeting) {
  return new Promise((resolve, reject) => {
    const token = process.env.VERCEL_API_TOKEN;
    const getDeploymentIdUrl =
      "https://api.vercel.com/v13/deployments/lasapip.com";

    axios
      .get(getDeploymentIdUrl, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        const deploymentId = res.data.id.substring(4);
        const gitSource = res.data.gitSource;

        const deployUrl = `https://api.vercel.com/v13/deployments`;

        axios
          .post(
            deployUrl,
            {
              deploymentId,
              gitSource,
              name: "lasapip",
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
            console.error(err);

            reject(err);
          });
      })
      .catch((err) => {
        console.error(err);

        reject(err);
      });
  });
}
