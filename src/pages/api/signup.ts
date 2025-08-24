// src/pages/api/signup.ts
import { NextApiRequest, NextApiResponse } from "next";
import { connectDB } from "@/Utils/db";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  console.log('/api/signup 들어옴');

  // CORS 설정
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,DELETE,PUT,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  try {
    if (req.method === 'POST') {
      const { email, password } = req.body as { email: string; password: string };
      console.log('요청 body:', { email, password });

      // DB 연결
      const client = await connectDB;
      const db = client.db('mydb');

      // 사용자 삽입
      await db.collection('user').insertOne({ email, password });
      return res.status(200).json({ success: 'OK' });
    } else {
      console.log('POST 외 요청 들어옴:', req.method);
      return res.status(501).json({ error: 'NOT POST' });
    }
  } catch (error) {
    console.error('회원가입 에러:', error);
    return res.status(500).json({ error: '서버 오류 발생' });
  }
}