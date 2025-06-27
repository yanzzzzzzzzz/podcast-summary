# Podcast Summary

這是一個 Podcast 音檔摘要服務，包含前端和後端。

## 主要功能

- 上傳音檔或輸入 Podcast 連結，自動產生摘要
- 可查詢歷史上傳紀錄

## 目錄結構

- `frontend/` 前端程式碼
- `backend/`  後端程式碼

## 主要技術

- 前端：Vue 3 + Vuetify
- 後端：Node.js + Express
- 語音辨識/摘要：AI 服務

## 快速啟動

### Docker 一鍵啟動

1. 安裝 Docker
2. 在專案根目錄執行：

   ```bash
   docker-compose up --build
   ```

3. 前端網址：<http://localhost:3000>  
   後端 API：<http://localhost:3456>

### 本地端手動啟動

#### 啟動後端

```bash
cd backend
npm install
npm run build
npm start
```

#### 啟動前端

```bash
cd frontend
npm install
npm run dev
```

## 其他注意事項

- **需安裝 ffmpeg**
  - Windows 可至 <https://ffmpeg.org/download.html> 下載並設好環境變數
  - macOS 可用 `brew install ffmpeg`
  - Linux 可用 `sudo apt install ffmpeg`

- **後端需設定 .env 檔**
  - 請參考 `backend/example.env`，填好參數後將檔名改為 `.env`，放在 `backend/` 資料夾下
