import { NextRequest, NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

export async function POST(request: NextRequest) {
  try {
    const { imageDataUrl } = await request.json();
    if (!imageDataUrl) {
      return NextResponse.json({ error: '画像が必要です' }, { status: 400 });
    }

    const match = imageDataUrl.match(/^data:(.+);base64,(.+)$/);
    if (!match) {
      return NextResponse.json({ error: '無効な画像形式です' }, { status: 400 });
    }
    const [, rawType, base64Data] = match;
    const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'] as const;
    type ValidType = typeof validTypes[number];
    if (!validTypes.includes(rawType as ValidType)) {
      return NextResponse.json({ error: 'JPEG/PNG/WEBP形式のみ対応しています' }, { status: 400 });
    }
    const mediaType = rawType as ValidType;

    const message = await client.messages.create({
      model: 'claude-sonnet-4-6',
      max_tokens: 1024,
      messages: [{
        role: 'user',
        content: [
          {
            type: 'image',
            source: { type: 'base64', media_type: mediaType, data: base64Data },
          },
          {
            type: 'text',
            text: `この食事の写真を分析して、栄養素情報をJSONのみで返してください。他のテキストは不要です。

{
  "food_description": "料理の説明（日本語、簡潔に）",
  "calories": 推定カロリー（整数・kcal）,
  "protein_g": タンパク質（小数・グラム）,
  "carbs_g": 炭水化物（小数・グラム）,
  "sugar_g": 糖質（小数・グラム）,
  "fat_g": 脂質（小数・グラム）,
  "fiber_g": 食物繊維（小数・グラム）
}`,
          },
        ],
      }],
    });

    const text = message.content[0].type === 'text' ? message.content[0].text : '';
    const cleaned = text.trim().replace(/^```(?:json)?\n?/, '').replace(/\n?```$/, '');
    return NextResponse.json(JSON.parse(cleaned));
  } catch (err) {
    console.error('analyze error:', err);
    return NextResponse.json({ error: '解析中にエラーが発生しました' }, { status: 500 });
  }
}
