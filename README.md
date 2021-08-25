# 360linkunify
_experimental sciprt that unified search by ProQuest(SerialsSolutions) 360 Link API._
360LinkのXML APIを使って、リンクリゾルバの横断検索？のようなことをしてみる実験です。

## How to
* ダウンロードして、コマンドラインのスクリプトして使えます。
* 参考までに、node nexe で windows10用の実行ファイル（exe）を作成しています。

## Usage
* DOIまたはISSNを指定できます。
* 出力はJSON形式か、テキストベタ打ちを選択します。
* -h でヘルプが使えます。

`node 360linkunifysearch.js -d 10.1080/01930826.2015.1105041 --format json`

## Feature
* 電子リソース共有の検討のためのプロトタイプです。