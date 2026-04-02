# 8-Bit Music Game Station - 技術仕様・要件定義書 (Technical Specification)

このドキュメントは、8ビット音楽制作ワークステーションの機能、技術構成、および 64ステップ（4小節）拡張を含む重要な修正についてまとめたものです。

---

## 1. プロジェクト概要 (Overview)
「ポケットモンスター」シリーズのようなレトロな 8ビットゲーム音楽（チップチューン）を、ブラウザ上で簡単に作成・編集・AI生成できる DAW アプリケーション。

## 2. 主要機能 (Key Features)

### 2.1 シーケンサー (Sequencer)
- **64ステップ・マトリックス**: Lead, Bass, Percussion の 3トラック構成。
- **4小節ループ再生**: 16ステップから 64ステップ（4小節）へ拡張。1拍 = 4ステップ。
- **UI表示**: 横スクロール可能なインターフェースを採用。1小節（16ステップ）ごとに境界線と Bar ラベルを配置。
- **リアルタイム再生**: 現在の再生位置を 64ステップに渡ってハイライト。

### 2.2 AI 作曲エンジン (AI Composer)
- **Magenta.js (MusicVAE)**: `trio_4bar` モデルを使用。
- **一括生成**: 4小節分（64ステップ）のシーケンスを生成。
- **Musical Profile (シーン選択)**: `Adventure`, `Battle`, `Town`, `Dungeon` の4プロファイル。
- **Music Theory フィルタ**: 生成後に `MusicHelper` がスケール、コード進行、リズムパターン（Walking, Octave, Syncopated）を動的に適用。
- **メロディの輪郭保存 (Contour Preservation)**: AIフレーズの形状を維持しつつ、音楽的に正しい音階へリアルタイム補正。

### 2.3 オーディオ & ビジュアル (Audio & Visuals)
- **8-bit サウンドチェイン**: `BitCrusher` (8-bit) と `polySynth` によるチップチューンサウンド。
- **リアルタイム・ビジュアライザー**: `Canvas API` による 256サンプルの波形監視。

### 2.4 エクスポート & 永続化 (Storage & Export)
- **localStorage 保存**: 64ステップ分のシーケンス、BPM、プロファイル情報を自動保存。
- **MIDI エクスポート**: 64ステップ（4小節）分すべての情報を MIDI ファイルとして出力。

---

## 3. 技術スタック (Tech Stack)

| カテゴリ | 使用技術 | 備考 |
| :--- | :--- | :--- |
| **Frontend Framework** | React 19 | 最新の React 環境 |
| **Audio Engine** | Tone.js (v14.9.17) | 安定性と Magenta.js 互換のため固定 |
| **AI Engine** | @magenta/music | MusicVAE (trio_4bar) モデルを使用 |
| **Music Theory Engine** | MusicHelper (Custom) | プロファイルベースの補正エンジン |
| **Bundler** | Vite | `define` によるポリフィル制御、ポート 5174 |

---

## 4. 安定化と拡張の記録 (Implementation Notes)

### 4.1 64ステップ拡張
- AI 生成ロジックの `% 16` 制限を解除し、`n.quantizedStartStep` を直接 64 ステップまでマッピング可能に。
- シーケンサーグリッドを横幅 1600px に固定し、`overflow-x-auto` によるスクロール操作を実装。

### 4.2 音楽性の向上 (Engine Overhaul)
- **状態の統合**: 重複していた Mood と Style を `activeProfile` へ一本化。UI を直感的なシーン選択へ再構成。
- **インテリジェント・マッピング**: AIのリズム意図を維持しつつ、強拍へのキック/スネア自動配置を実装。
- **終止形 (Cadence)**: 4小節の最終ステップをルート音へ誘導。

### 4.3 起動時クラッシュの解決
- `vite.config.ts` の `define` ブロックにて `process.hrtime` を Web API にポリフィル。
- AudioContext 制限を回避するため、ユーザーアクション時に非同期で `audioEngine.init()` を呼び出す構造を採用。

---
*Last Updated: 2026-04-03 (Engine Overhaul & Profile integration)*
