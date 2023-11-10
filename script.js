// Google Sheets API の設定
const apiKey = "AIzaSyB2GHVSqVfrL5ThNJMKjRGBeSU-SdoNryE";
const spreadsheetId = "1akqj9_cswFIwSwd_7AFVQn6Ud6Gf4SEpPYtXIcqdvLA";
// .loadingクラスの要素を取得
var loadingElement = document.querySelector('.loading');

// 要素を非表示にする
loadingElement.style.display = 'none';
// 検索処理
function search() {
  const keyword = document.getElementById("keywordInput").value;
  if (keyword === "") {
    alert("キーワードを入力してください");
    return;
  }
  loadingElement.style.display = 'block'; 
setTimeout(function() {
  // Google Sheets API を使用してデータを取得するリクエストを作成
  const url = `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/Sheet1?key=${apiKey}`;
  

  fetch(url)
    .then((response) => response.json())
    .then((data) => {
      const results = data.values.filter((row) => {
        // 会社、ゲーム名、アルバム名、YouTubeのURLのいずれかにキーワードが含まれるかどうかをチェック
        const [company, gameName, albumName, youtubeUrl] = row;
        return (
          company.includes(keyword) ||
          gameName.includes(keyword) ||
          albumName.includes(keyword) ||
          youtubeUrl.includes(keyword)
        );
      });

        // 検索結果を表示
        displayResults(results);

        // loadingElementを非表示にする
        loadingElement.style.display = 'none';
      })
      .catch((error) => {
        console.error("検索エラー:", error);
        // エラーが発生した場合もloadingElementを非表示にする
        loadingElement.style.display = 'none';
      });
  }, 3000); // 3000ミリ秒（3秒）後にデータを取得する
}
//  検索結果を表示する処理
function displayResults(results) {
  const resultsDiv = document.getElementById("results");
  resultsDiv.innerHTML = "";
  if (results.length === 0) {
    resultsDiv.innerHTML = "該当するゲームは見つかりませんでした。";
    return;
  }

  results.forEach((row) => {
    const [company, gameName, albumName, youtubeUrl] = row;
    // 検索結果のタイトルを表示
    const title = document.createElement("p");
    title.textContent = `${company} - ${gameName} (${albumName})`;

    // YouTubeの埋め込みプレーヤーを表示するiframeを作成
    const iframe = document.createElement("iframe");
    iframe.width = "391";
    iframe.height = "220";
    iframe.src = youtubeUrl;
    iframe.frameBorder = "0";
    iframe.allowFullscreen = true;

    // 検索結果として表示する要素をdivで包む
    const resultDiv = document.createElement("div");
    resultDiv.appendChild(title);
    resultDiv.appendChild(iframe);

    // 検索結果のコンテナに追加
    resultsDiv.appendChild(resultDiv);
  });
}