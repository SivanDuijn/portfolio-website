import type { NextApiRequest, NextApiResponse } from "next";

// TODO: Don't use next api, make server use SSL and directly call api in browser
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "POST") {
    await fetch("http://174.138.106.40/create-triplet", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(req.body),
    }).then((r) =>
      r
        .json()
        .then((result) => {
          res.status(200).json(result);
        })
        .catch((reason) => {
          res.status(500).json(reason);
        }),
    );
  } else {
    res.status(405).send("Method not allowed");
  }
}
