import { imgData } from "./imgData";
import { formatDate } from "./modules/formatDate";
import "./styles.css";

// // 画像一覧を表示
(async () => {
  for (const imgURL of imgData) {
    try {
      const fetchImg = await fetchImage(imgURL);
      const ImgData = await getImgElm(fetchImg); // 画像データ取得
      const modified = await getModified(fetchImg); // 更新日取得

      // 要素生成
      createImg(ImgData, modified);
    } catch (e) {
      console.error(e);
    }
  }
})();

// fetch
async function fetchImage(target) {
  const response = await fetch(target);
  if (response.ok) {
    return response;
  }
}

// 画像データ取得
function getImgElm(target) {
  const imgElm = document.createElement("img");
  imgElm.src = target.url;

  // 画像の読み込み完了まで待つ
  return new Promise(function (resolve, reject) {
    let loadImgFlg = true;

    // 画像が取得できなかった場合
    imgElm.addEventListener("error", function () {
      loadImgFlg = false;
      imgElm.src = "src/images/noimage.jpg";
      resolve({ imgElm, width: "-", height: "-", loadImgFlg });
    });
    // 画像を取得できた場合
    if (loadImgFlg) {
      imgElm.addEventListener("load", function () {
        const width = imgElm.naturalWidth;
        const height = imgElm.naturalHeight;
        resolve({ imgElm, width, height, loadImgFlg });
      });
    }
  });
}

// 更新日取得
async function getModified(target) {
  const headers = target.headers;
  let lastModified = "";
  //　更新日時を取得（GMT）
  for (var pair of headers.entries()) {
    if (pair[0] === "last-modified") {
      lastModified = pair[1];
    }
  }
  return lastModified;
}

// 要素生成
async function createImg(targetImg, targetModified) {
  const imgArea = document.getElementById("imgArea");
  const imgElm = targetImg.imgElm;
  const divElm = document.createElement("div");
  const pElm = document.createElement("p");
  const spanElm = document.createElement("span");
  spanElm.textContent = `サイズ：${targetImg.width} × ${targetImg.height}`;

  // 画像の読み込み完了で更新日時の表示を分ける
  if (targetImg.loadImgFlg) {
    pElm.textContent = `更新日時:${formatDate(targetModified)}`;
  } else {
    pElm.textContent = `更新日時: -年-月-日`;
  }

  divElm.appendChild(imgElm);
  pElm.appendChild(spanElm);
  divElm.appendChild(pElm);
  imgArea.appendChild(divElm);
}
