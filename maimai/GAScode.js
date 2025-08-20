// VSCodeで編集した場合はclasp pushでGASに反映されます

function doPost(e) {
  Logger.log(e.postData.contents);
  // Webアプリから送信されたJSONデータを解析
  var data = JSON.parse(e.postData.contents);
  
  // スプレッドシートを取得
  var spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = spreadsheet.getSheetByName("シート1"); // データの書き込み先シート名

  // タイムスタンプを生成
  var timestamp = new Date();

  // JSONデータから情報を取得
  var 担当者名 = data.担当者名;
  var 運転時間 = data.機械データ.運転時間;
  var 生産量 = data.機械データ.生産量;
  var 異常チェック = data.機械データ.異常チェック;

  // スプレッドシートに書き込むデータを行としてまとめる
  // [日付, 担当者名, 運転時間, 生産量, 異常チェック]の順で書き込みます
  var rowData = [
    timestamp,
    担当者名,
    運転時間,
    生産量,
    異常チェック
  ];

  // データをシートの最終行に追記
  sheet.appendRow(rowData);

  // 処理が成功したことをWebアプリに返す
  return ContentService.createTextOutput("Success").setMimeType(ContentService.MimeType.TEXT);
}
