import { RekognitionClient, DetectLabelsCommand } from "@aws-sdk/client-rekognition";
import { readFileSync } from "fs";
import path from "path";

// ファイルパスをコマンドライン引数から取得
const imagePath = process.argv[2];

if (!imagePath) {
  console.error("使用法: node detectLabels.js <画像ファイルのパス>");
  process.exit(1);
}

// AWSリージョンを設定
const client = new RekognitionClient({ region: "us-east-1" });

async function detectImageLabels() {
  try {
    // 画像ファイルをバイナリデータとして読み込む
    const imageBytes = readFileSync(path.resolve(imagePath));

    const command = new DetectLabelsCommand({
      Image: {
        Bytes: imageBytes,
      },
      MaxLabels: 10, // 取得するラベルの最大数
      MinConfidence: 70, // 信頼度（%)の最小値
    });

    const response = await client.send(command);

    console.log("検出されたラベル:");
    if (response.Labels) {
      response.Labels.forEach(label => {
        console.log(`- ${label.Name}: ${label.Confidence.toFixed(2)}%`);
      });
    } else {
      console.log("ラベルは検出されませんでした。");
    }

  } catch (error) {
    console.error("エラーが発生しました:", error);
  }
}

detectImageLabels();
