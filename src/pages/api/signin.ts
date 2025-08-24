// src/pages/api/signin.ts
import { NextApiRequest, NextApiResponse } from "next";
import { connectDB } from "@/Utils/db";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  console.log('/api/signin 들어옴');

  // CORS 설정 (테스트용)
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
      const client = await connectDB; // db.ts에서는 이미 Promise<MongoClient>
      const db = client.db('mydb');

      // 사용자 찾기
      const user = await db.collection('user').findOne({ email, password });
      console.log('찾은 유저:', user);

      if (user) {
        return res.status(200).json({
          email: user.email,
          token: String(user._id),
        });
      } else {
        return res.status(401).json({
          error: '아이디 또는 비밀번호가 일치하지 않습니다',
        });
      }
    } else {
      console.log('POST 외 요청 들어옴:', req.method);
      return res.status(501).json({ error: 'NOT POST' });
    }
  } catch (error) {
    console.error('서버 오류:', error);
    return res.status(500).json({ error: '서버 오류 발생' });
  }
}
