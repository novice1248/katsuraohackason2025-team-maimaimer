function doPost(e) {
  try {
    Logger.log("Received data: " + e.postData.contents);
    var postData = JSON.parse(e.postData.contents);

    var spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
    var sheet = spreadsheet.getSheetByName("シート1"); // データの書き込み先シート名

    // ヘッダー行の初期設定
    var initialHeadersRow1 = ["場所", "施設", "地点番号", "項目名"];
    var initialHeadersRow2 = ["", "", "", "担当者"];

    var headers1 = []; // 1行目のヘッダー (日付など)
    var headers2 = []; // 2行目のヘッダー (担当者名など)

    if (sheet.getLastRow() < 2) { // 少なくとも2行のヘッダーが必要
      sheet.clearContents(); // 既存の内容をクリアして新しいヘッダーを設定
      sheet.getRange(1, 1, 1, initialHeadersRow1.length).setValues([initialHeadersRow1]);
      sheet.getRange(2, 1, 1, initialHeadersRow2.length).setValues([initialHeadersRow2]);
      headers1 = initialHeadersRow1;
      headers2 = initialHeadersRow2;
    } else {
      headers1 = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
      headers2 = sheet.getRange(2, 1, 1, sheet.getLastColumn()).getValues()[0];
    }

    var allData = sheet.getDataRange().getValues();
    var dataRows = allData.slice(2); // ヘッダー2行を除くデータ行 (3行目から)

    var rowMap = {}; // キー: "場所-施設-項目名", 値: データ行インデックス (0-indexed for dataRows)
    var locationItemPointMap = {}; // キー: "場所-施設-項目名", 値: 地点番号
    var maxPointNumber = 0;

    // 既存データを読み込み、マップを作成
    for (var i = 0; i < dataRows.length; i++) {
      var row = dataRows[i];
      var place = row[0];
      var facility = row[1];
      var pointNumber = row[2];
      var itemName = row[3];

      var key = place + "-" + facility + "-" + itemName;
      rowMap[key] = i; // データ行の0-indexedインデックス

      if (pointNumber && typeof pointNumber === 'number' && pointNumber > maxPointNumber) {
        maxPointNumber = pointNumber;
      }
      if (pointNumber) {
        locationItemPointMap[key] = pointNumber;
      }
    }

    // JSONデータから基本情報を取得
    var timestamp = postData.タイムスタンプ ? new Date(postData.タイムスタンプ) : new Date();
    var formattedDate = Utilities.formatDate(timestamp, Session.getScriptTimeZone(), "yyyy/MM/dd");
    var 担当者名 = postData.担当者名 || '不明';
    var data = postData.データ || {};

    // 新しい日付のヘッダーが存在するか確認し、必要であれば追加
    var dateColIndex = headers1.indexOf(formattedDate);
    if (dateColIndex === -1) {
      // 新しい日付のヘッダーを追加
      headers1.push(formattedDate);
      headers2.push(担当者名); // 2行目には担当者名を追加
      sheet.getRange(1, 1, 1, headers1.length).setValues([headers1]);
      sheet.getRange(2, 1, 1, headers2.length).setValues([headers2]);
      dateColIndex = headers1.indexOf(formattedDate); // 新しいインデックスを取得
    } else {
      // 既存の日付列に担当者名を更新
      headers2[dateColIndex] = 担当者名;
      sheet.getRange(2, 1, 1, headers2.length).setValues([headers2]);
    }

    // ネストされたデータをループ処理で展開し、適切な位置に書き込む
    for (var placeName in data) {
      if (data.hasOwnProperty(placeName)) {
        var categories = data[placeName];
        for (var categoryName in categories) {
          if (categories.hasOwnProperty(categoryName)) {
            var items = categories[categoryName];
            for (var itemName in items) {
              if (items.hasOwnProperty(itemName)) {
                var value = items[itemName];

                var key = placeName + "-" + categoryName + "-" + itemName;
                var pointNumberToUse;

                if (!locationItemPointMap[key]) {
                  maxPointNumber++;
                  locationItemPointMap[key] = maxPointNumber;
                  pointNumberToUse = maxPointNumber;
                } else {
                  pointNumberToUse = locationItemPointMap[key];
                }

                var targetDataRowIndex = rowMap[key]; // 0-indexed for dataRows

                if (targetDataRowIndex !== undefined) {
                  // 既存の行が見つかった場合
                  var row = allData[targetDataRowIndex + 2]; // スプレッドシートの実際の行データ (ヘッダー2行分オフセット)
                  
                  // 既存の行の長さを確認し、必要に応じて拡張
                  if (row.length <= dateColIndex) {
                    for (var k = row.length; k <= dateColIndex; k++) {
                      row.push(""); // 空のセルで埋める
                    }
                  }
                  row[dateColIndex] = value;
                  sheet.getRange(targetDataRowIndex + 3, 1, 1, row.length).setValues([row]); // +3 because 0-indexed dataRows + 2 headers + 1 for actual row number

                } else {
                  // 新しい行を作成する場合
                  var newRowData = [];
                  newRowData[0] = placeName;
                  newRowData[1] = categoryName;
                  newRowData[2] = pointNumberToUse;
                  newRowData[3] = itemName;

                  // ヘッダーの長さに合わせて空のセルで埋める
                  for (var k = 4; k < headers1.length; k++) {
                    newRowData[k] = "";
                  }
                  newRowData[dateColIndex] = value;

                  sheet.appendRow(newRowData);
                  // 新しく追加された行をマップに登録
                  rowMap[key] = sheet.getLastRow() - 3; // 0-indexed dataRows
                }
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
