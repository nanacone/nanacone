const SUPABASE_URL =
  "https://sffwqzhtshtcbernkkqw.supabase.co";

const SUPABASE_KEY =
  "sb_publishable_fch9IIBoJIGXs0X1nT6jhA_zTe9Mp2F";

const supabaseClient =
  supabase.createClient(
    SUPABASE_URL,
    SUPABASE_KEY
  );


// =========================
// localStorage
// =========================




// =========================
// ページモード
// =========================

const urlParams =
  new URLSearchParams(
    window.location.search
  );

const pageMode =
  urlParams.get("mode");

  const documentType =
  urlParams.get("type") === "estimate"
    ? "estimate"
    : "invoice";

const isEstimate =
  documentType === "estimate";

  const STORAGE_KEY =
  isEstimate
    ? "nanaconne_estimate_draft"
    : "nanaconne_invoice_draft";



const autoDownload =
  urlParams.get("auto") === "1";

const viewedDocumentId =
  localStorage.getItem(
    "nanaconne_view_document_id"
  );

const reissueDocumentId =
  localStorage.getItem(
    "nanaconne_reissue_document_id"
  );


// PDF二重生成防止
let isPdfGenerating = false;


// =========================
// テキスト表示
// =========================

function setText(
  id,
  value,
  fallback = ""
) {

  const element =
    document.getElementById(id);

  if (element) {
    element.textContent =
      value || fallback;
  }

}


// =========================
// 請求書を表示
// =========================

function renderCompleteInvoice() {

  const rawDraft =
    localStorage.getItem(
      STORAGE_KEY
    );

  if (!rawDraft) {
    return;
  }


  let draft;

  try {

    draft =
      JSON.parse(rawDraft);

  } catch (error) {

    console.error(
      "請求書データを読み込めませんでした。",
      error
    );

    return;
  }


  // =========================
  // 基本情報
  // =========================

  setText(
    "preview-client",
    draft.clientName,
    "株式会社サンプル"
  );

  setText(
    "preview-issue-date",
    draft.issueDate,
    "2026年○月○日"
  );

  setText(
    "preview-invoice-number",
    draft.invoiceNumber,
    "INV-2026001"
  );

  setText(
    "preview-company-name",
    draft.companyName,
    "〇〇会社"
  );

  setText(
    "preview-company-postcode",
    draft.companyPostcode
      ? `〒${draft.companyPostcode}`
      : "",
    "〒〇〇〇-〇〇〇〇"
  );

  setText(
    "preview-company-address",
    draft.companyAddress,
    "東京都〇〇区〇〇"
  );

  setText(
    "preview-company-tel",
    draft.companyTel,
    "〇〇-〇〇-〇〇"
  );

  setText(
    "preview-company-number",
    draft.companyNumber
      ? `T${draft.companyNumber}`
      : "",
    "T"
  );

  setText(
    "preview-bank-name",
    draft.bankName,
    "〇〇銀行"
  );

  setText(
    "preview-bank-branch",
    draft.bankBranch,
    "〇〇支店"
  );

  setText(
    "preview-bank-account",
    draft.bankAccount,
    "123456"
  );

  setText(
    "preview-note",
    draft.note
  );


  // =========================
  // 支払い期日
  // =========================

  if (draft.paymentDate) {

    const date =
      new Date(
        `${draft.paymentDate}T00:00:00`
      );

    setText(
      "preview-payment-date",
      `${date.getFullYear()}年` +
      `${date.getMonth() + 1}月` +
      `${date.getDate()}日`
    );

  }


  // =========================
  // 明細
  // =========================

  const itemsBody =
    document.getElementById(
      "preview-items-body"
    );

  if (!itemsBody) {
    return;
  }

  // 二重表示防止
  itemsBody.innerHTML = "";

  let subtotal = 0;


  (draft.items || []).forEach(
    (item) => {

      const quantity =
        Number(item.qty) || 0;

      const unitPrice =
        Number(item.unitPrice) || 0;

      const amount =
        quantity * unitPrice;

      subtotal += amount;


      const row =
        document.createElement("tr");


      const values = [

        item.name ||
          "デザイン制作費",

        quantity,

        item.unit ||
          "式",

        `￥${unitPrice.toLocaleString()}`,

        `￥${amount.toLocaleString()}`

      ];


      values.forEach(
        (value) => {

          const cell =
            document.createElement("td");

          cell.textContent =
            value;

          row.appendChild(cell);

        }
      );


      itemsBody.appendChild(row);

    }
  );


  // =========================
  // 合計
  // =========================

  const tax =
    Math.floor(
      subtotal * 0.1
    );

  const total =
    subtotal + tax;


  setText(
    "preview-grand-total",
    total.toLocaleString()
  );


  const summaries = [

    [
      "小計（税抜）",
      subtotal
    ],

    [
      "消費税（10%）",
      tax
    ],

    [
      "合計（税込）",
      total
    ]

  ];


  summaries.forEach(
    ([label, amount]) => {

      const row =
        document.createElement("tr");

      row.className =
        "summary-row";

      row.innerHTML = `
        <td colspan="3"></td>
        <td>${label}</td>
        <td>
          ￥${amount.toLocaleString()}
        </td>
      `;

      itemsBody.appendChild(row);

    }
  );


  // =========================
  // 角印
  // =========================

  if (draft.stamp) {

    const stamp =
      document.getElementById(
        "stamp-preview"
      );

    if (stamp) {

      stamp.src =
        draft.stamp;

      stamp.parentElement
        ?.classList.add(
          "has-image"
        );

    }

  }

}


// =========================
// PDFを生成する
// =========================

async function downloadInvoicePdf() {

  // 二重クリック防止
  if (isPdfGenerating) {
    return;
  }

  isPdfGenerating = true;


  const purchaseButton =
    document.getElementById(
      "purchase-button"
    );

  if (purchaseButton) {

    purchaseButton.disabled =
      true;

  }


  try {

    // =========================
    // ログイン確認
    // =========================

    const {
      data: userData,
      error: userError
    } =
      await supabaseClient
        .auth
        .getUser();


    if (
      userError ||
      !userData.user
    ) {

      console.error(
        "ログイン確認エラー:",
        userError
      );

      alert(
        "ログインしていません。"
      );

      return;
    }


    const user =
      userData.user;


    // =========================
    // 請求書データ取得
    // =========================

    const rawDraft =
      localStorage.getItem(
        STORAGE_KEY
      );


    if (!rawDraft) {

      alert(
        "請求書データがありません。"
      );

      return;
    }


    let draft;

    try {

      draft =
        JSON.parse(rawDraft);

    } catch (error) {

      console.error(
        "請求書データ読み込みエラー:",
        error
      );

      alert(
        "請求書データを読み込めませんでした。"
      );

      return;
    }


    // =========================
    // 合計計算
    // =========================

    let subtotal = 0;


    (draft.items || []).forEach(
      (item) => {

        const quantity =
          Number(item.qty) || 0;

        const unitPrice =
          Number(item.unitPrice) || 0;

        subtotal +=
          quantity * unitPrice;

      }
    );


    const tax =
      Math.floor(
        subtotal * 0.1
      );

    const totalAmount =
      subtotal + tax;


    // =========================
    // Supabaseへ保存
    //
    // view / reissue は
    // すでに保存済みなので
    // 新規追加しない
    // =========================

    if (
      pageMode !== "reissue" &&
      pageMode !== "view"
    ) {

      const {
        data: savedDocument,
        error: insertError
      } =
        await supabaseClient
          .from("documents")
          .insert({

            user_id:
              user.id,

            client_name:
              draft.clientName || "",

            invoice_number:
              draft.invoiceNumber || "",

            issue_date:
              draft.issueDate || null,

            total_amount:
              totalAmount,

            due_date:
              draft.paymentDate || null,

            document_data:
              draft

          })
          .select()
          .single();


      if (insertError) {

        console.error(
          "書類保存エラー:",
          insertError
        );

        alert(
          "書類を保存できませんでした。"
        );

        return;
      }


      console.log(
        "保存成功:",
        savedDocument
      );

    } else {

      console.log(
        "保存済み書類のため新規保存をスキップしました"
      );

    }


    // =========================
    // PDF対象
    // =========================

    const invoice =
      document.getElementById(
        "complete-invoice"
      );


    if (!invoice) {

      alert(
        "請求書を表示できませんでした。"
      );

      return;
    }


    const watermark =
      invoice.querySelector(
        ".sample-watermark"
      );


    // =========================
    // PDF生成モード
    // =========================

    invoice.classList.add(
      "pdf-export-mode"
    );


    // =========================
    // ブランド表示
    // =========================

    let brand =
      invoice.querySelector(
        ".invoice-brand"
      );


    if (!brand) {

      brand =
        document.createElement(
          "div"
        );

      brand.className =
        "invoice-brand";

      brand.textContent =
        "取引書類作成ツール nanaconne";

      invoice.appendChild(
        brand
      );

    }


    brand.style.setProperty(
      "display",
      "block",
      "important"
    );

    brand.style.setProperty(
      "visibility",
      "visible",
      "important"
    );

    brand.style.setProperty(
      "opacity",
      "1",
      "important"
    );

    brand.style.setProperty(
      "position",
      "absolute",
      "important"
    );

    brand.style.setProperty(
      "right",
      "24px",
      "important"
    );

    brand.style.setProperty(
      "bottom",
      "18px",
      "important"
    );

    brand.style.setProperty(
      "font-size",
      "10px",
      "important"
    );

    brand.style.setProperty(
      "font-weight",
      "400",
      "important"
    );

    brand.style.setProperty(
      "color",
      "#999",
      "important"
    );

    brand.style.setProperty(
      "white-space",
      "nowrap",
      "important"
    );

    brand.style.setProperty(
      "letter-spacing",
      "0.03em",
      "important"
    );

    brand.style.setProperty(
      "z-index",
      "9999",
      "important"
    );


    invoice.style.setProperty(
      "position",
      "relative",
      "important"
    );


    // =========================
    // SAMPLEを消す
    // =========================

    if (watermark) {

      watermark.style.display =
        "none";

    }


    // =========================
    // PDF設定
    // =========================

    const invoiceNumber =
      draft.invoiceNumber ||
      "invoice";


    const pdfOptions = {

      margin: 0,

      filename:
        `${invoiceNumber}.pdf`,

      image: {
        type: "jpeg",
        quality: 0.98
      },

      html2canvas: {
        scale: 2,
        useCORS: true,
        scrollX: 0,
        scrollY: 0
      },

      jsPDF: {
        unit: "mm",
        format: "a4",
        orientation: "portrait"
      },

      pagebreak: {
        mode: [
          "avoid-all",
          "css",
          "legacy"
        ]
      }

    };


    // =========================
    // PDF生成
    // =========================

    await html2pdf()
      .set(pdfOptions)
      .from(invoice)
      .save();


    console.log(
      "PDFダウンロード成功"
    );


    // =========================
    // マイページから
    // 「再発行」した場合のみ
    // 自動で戻る
    // =========================

    if (
      pageMode === "reissue" &&
      autoDownload
    ) {

      setTimeout(() => {

        window.location.href =
          "./mypage.html";

      }, 800);

    }


  } catch (error) {

    console.error(
      "PDF作成エラー:",
      error
    );

    alert(
      "PDFを作成できませんでした。"
    );


  } finally {

    const invoice =
      document.getElementById(
        "complete-invoice"
      );

    const watermark =
      invoice?.querySelector(
        ".sample-watermark"
      );


    if (invoice) {

      invoice.classList.remove(
        "pdf-export-mode"
      );

    }


    if (watermark) {

      watermark.style.display =
        "";

    }


    isPdfGenerating =
      false;


    const purchaseButton =
      document.getElementById(
        "purchase-button"
      );


    if (purchaseButton) {

      purchaseButton.disabled =
        false;

    }

  }

}


// =========================
// 戻るボタン
// =========================

const backToEditButton =
  document.getElementById(
    "back-to-edit"
  );


if (backToEditButton) {

  if (
    pageMode === "view" ||
    pageMode === "reissue"
  ) {

    backToEditButton.textContent =
      "マイページへ戻る";

    purchaseButton.addEventListener(
  "click",
  () => {

    const invoice =
      document.getElementById(
        "complete-invoice"
      );

    if (invoice) {

      localStorage.setItem(
        "nanaconne_download_document",
        invoice.outerHTML
      );

    }


    const paymentUrl =
      isEstimate
        ? "./payment.html?type=estimate"
        : "./payment.html?type=invoice";


    window.location.href =
      paymentUrl;

  }
);

  } else {

    backToEditButton.textContent =
      "入力画面へ戻る";

    backToEditButton.addEventListener(
      "click",
      () => {

        window.location.href =
          isEstimate
            ? "./estimate-create.html"
            : "./create.html";

      }
    );

  }

}


// =========================
// メインボタン
// =========================

const purchaseButton =
  document.getElementById(
    "purchase-button"
  );


async function setupPurchaseButton() {

  if (!purchaseButton) {
    return;
  }


  // =========================
  // 再発行
  // =========================

  if (
    pageMode === "reissue" &&
    reissueDocumentId
  ) {

    purchaseButton.textContent =
      "PDFを再発行する";

    purchaseButton.classList.add(
      "reissue-button"
    );

    purchaseButton.addEventListener(
      "click",
      downloadInvoicePdf
    );

    return;
  }


  // =========================
  // 保存済み書類の表示
  // =========================

  if (
    pageMode === "view" &&
    viewedDocumentId
  ) {

    purchaseButton.textContent =
      "PDFを再発行する";

    purchaseButton.classList.add(
      "reissue-button"
    );

    purchaseButton.addEventListener(
      "click",
      downloadInvoicePdf
    );

    return;
  }


  // =========================
  // ログイン状態を確認
  // =========================

  const {
    data,
    error
  } =
    await supabaseClient.auth.getUser();


  const isLoggedIn =
    !error && !!data.user;


  const fromMypage =
    localStorage.getItem(
      "nanaconne_from_mypage"
    ) === "1";


  // =========================
  // ログイン中 ＋
  // マイページから作成
  // =========================

  if (
    isLoggedIn &&
    fromMypage
  ) {

    purchaseButton.textContent =
      "PDFをダウンロード";

    purchaseButton.classList.add(
      "member-download-button"
    );

    purchaseButton.addEventListener(
      "click",
      downloadInvoicePdf
    );

    return;
  }


  // =========================
  // ログアウト状態
  // → 必ず単発購入
  // =========================

  localStorage.removeItem(
    "nanaconne_from_mypage"
  );

  purchaseButton.textContent =
    "購入してPDFをダウンロード";

  purchaseButton.classList.remove(
    "member-download-button"
  );

  purchaseButton.addEventListener(
    "click",
    () => {

      window.location.href =
        "./payment.html";

    }
  );

}


setupPurchaseButton();

// =========================
// 初期表示
// =========================

function setupDocumentType() {

  if (!isEstimate) {
    return;
  }

  // ページタイトル
  document.title =
    "見積書確認 | ナナコネ";


  // 上部タイトル
  setText(
    "complete-document-heading",
    "見積書を確認"
  );


  // 書類番号
  setText(
    "document-number-label",
    "見積書番号"
  );


  // 書類タイトル
  setText(
    "complete-document-title",
    "見 積 書"
  );


  // メッセージ
  setText(
    "complete-document-message",
    "下記の通りお見積り申し上げます。"
  );


  // 金額タイトル
  setText(
    "complete-total-label",
    "お見積金額"
  );

}
setupDocumentType();

renderCompleteInvoice();


// =========================
// マイページの「再発行」
// → 自動PDF生成
// =========================

if (
  pageMode === "reissue" &&
  autoDownload
) {

  window.setTimeout(
    downloadInvoicePdf,
    300
  );

}
// =========================
// スマホ確認画面
// プレビューサイズ調整
// =========================

function fitCompleteInvoice() {

  const invoice =
    document.getElementById(
      "complete-invoice"
    );

  const panel =
    document.querySelector(
      ".complete-preview-panel"
    );

  if (!invoice || !panel) {
    return;
  }


  // =========================
  // PC
  // =========================

  if (window.innerWidth > 768) {

    invoice.style.position = "";
    invoice.style.left = "";
    invoice.style.top = "";
    invoice.style.transform = "";
    invoice.style.transformOrigin = "";

    panel.style.position = "";
    panel.style.height = "";

    return;
  }


  // =========================
  // スマホ
  // =========================

  const invoiceWidth =
    invoice.offsetWidth || 720;

  const invoiceHeight =
    invoice.scrollHeight ||
    invoice.offsetHeight;

  const availableWidth =
    panel.clientWidth - 24;

  // プレビュー枠の高さ
  const scale =
  Math.min(
    availableWidth / invoiceWidth,
    1
  );


  panel.style.position =
    "relative";

  const scaledHeight =
  invoiceHeight * scale;

panel.style.height =
  `${scaledHeight + 24}px`;

  panel.style.overflow =
    "hidden";


  invoice.style.position =
    "absolute";

  invoice.style.left =
    "50%";

  invoice.style.top =
    "12px";

  invoice.style.transformOrigin =
    "top center";

  invoice.style.transform =
    `translateX(-50%) scale(${scale})`;
}


// 初回
window.addEventListener(
  "load",
  fitCompleteInvoice
);

// 画面サイズ変更
window.addEventListener(
  "resize",
  fitCompleteInvoice
);

// 描画後にも実行
setTimeout(
  fitCompleteInvoice,
  100
);