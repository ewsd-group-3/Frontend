import { Payment } from "@/types/table-type";
import { NextApiRequest, NextApiResponse } from "next";

async function getData(): Promise<Payment[]> {
  // Fetch data from your API here.
  return [
    {
      id: "728ed52f",
      amount: 100,
      status: "pending",
      email: "m@example.com",
    },
    {
      id: "728ed52f",
      amount: 100,
      status: "pending",
      email: "m@example.com",
    },
  ];
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "GET") {
    try {
      const data = await getData();
      res.status(200).json(data);
    } catch (error) {
      res.status(500).json({ message: "Internal Server Error" });
    }
  } else {
    res.setHeader("Allow", ["GET"]);
    res.status(405).json({ message: `Method ${req.method} Not Allowed` });
  }
}
