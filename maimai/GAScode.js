function doPost(e) {
  try {
    // どんなデータが送られてきたか、まずログに出力して確認
    Logger.log("Received data: " + e.postData.contents);

    // Webアプリから送信されたJSONデータを解析
    var postData = JSON.parse(e.postData.contents);
    
    // スプレッドシートを取得
    var spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
    var sheet = spreadsheet.getSheetByName("シート1"); // データの書き込み先シート名

    // ヘッダー行がなければ作成する
    if (sheet.getLastRow() === 0) {
      sheet.appendRow(["タイムスタンプ", "担当者名", "場所", "施設", "項目名", "値"]);
    }

    // JSONデータから基本情報を取得
    var timestamp = postData.タイムスタンプ || new Date();
    // ↓↓↓ ここにスペースを追加しました ↓↓↓
    var 担当者名 = postData.担当者名 || '不明'; 
    var data = postData.データ || {};

    // ネストされたデータをループ処理で展開し、一行ずつ書き込む
    for (var placeName in data) {
      if (data.hasOwnProperty(placeName)) {
        var categories = data[placeName];
        for (var categoryName in categories) {
          if (categories.hasOwnProperty(categoryName)) {
            var items = categories[categoryName];
            for (var itemName in items) {
              if (items.hasOwnProperty(itemName)) {
                var value = items[itemName];
                
                var rowData = [
                  timestamp,
                  担当者名,
                  placeName,
                  categoryName,
                  itemName,
                  value
                ];
                
                sheet.appendRow(rowData);
              }
            }
          }
        }
      }
    }

    return ContentService.createTextOutput("Success").setMimeType(ContentService.MimeType.TEXT);

  } catch (error) {
    Logger.log("Error occurred: " + error.toString());
    return ContentService.createTextOutput("Error: " + error.toString()).setMimeType(ContentService.MimeType.TEXT);
  }
}
