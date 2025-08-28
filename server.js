import express from 'express';
import multer from 'multer';
import { RekognitionClient, DetectLabelsCommand } from "@aws-sdk/client-rekognition";

const app = express();
const port = 3000;

// Multerの設定: 画像をメモリに一時的に保存
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const client = new RekognitionClient({ region: "us-east-1" });

app.use(express.static('public')); // publicディレクトリを静的ファイルとして公開

app.post('/upload', upload.single('image'), async (req, res) => {
  if (!req.file) {
    return res.status(400).send('画像ファイルがアップロードされていません。');
  }

  try {
    const command = new DetectLabelsCommand({
      Image: {
        Bytes: req.file.buffer, // アップロードされたファイルをバイナリデータとして使用
      },
      MaxLabels: 10,
      MinConfidence: 70,
    });

    const response = await client.send(command);
    res.json(response.Labels); // ラベル情報をJSONで返す

  } catch (error) {
    console.error("Rekognitionエラー:", error);
    res.status(500).json({ error: "画像の処理中にエラーが発生しました。" });
  }
});

app.listen(port, () => {
  console.log(`サーバーが http://localhost:${port} で起動しました。`);
});
