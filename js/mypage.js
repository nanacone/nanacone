const SUPABASE_URL = "https://sffwqzhtshtcbernkkqw.supabase.co";
const SUPABASE_KEY = "sb_publishable_fch9IIBoJIGXs0X1nT6jhA_zTe9Mp2F";

const supabaseClient = supabase.createClient(
  SUPABASE_URL,
  SUPABASE_KEY
);

async function loadCurrentUser() {

  const { data, error } =
    await supabaseClient.auth.getUser();

  if (error || !data.user) {
    console.log("ログインしているユーザーがいません");

    window.location.href = "./login.html";
    return;
  }

  const user = data.user;

  const displayName =
    user.user_metadata.display_name || "ユーザー";

  const email =
    user.email || "";


  // ヘッダーの名前
  const headerUserName =
    document.getElementById("header-user-name");

  if (headerUserName) {
    headerUserName.textContent = displayName;
  }


  // 「○○さん、おかえりなさい」
  const welcomeUserName =
    document.getElementById("welcome-user-name");

  if (welcomeUserName) {
    welcomeUserName.textContent = displayName;
  }


  // アカウント画面の名前
  const accountName =
    document.getElementById("account-name");

  if (accountName) {
    accountName.textContent = displayName;
  }


  // アカウント画面のメール
  const accountEmail =
    document.getElementById("account-email");

  if (accountEmail) {
    accountEmail.textContent = email;
  }

}

loadCurrentUser();

const logoutButton =
  document.querySelector(".logout-button");

if (logoutButton) {

  logoutButton.addEventListener("click", async () => {

    const { error } =
      await supabaseClient.auth.signOut();

    if (error) {
      console.error(error);
      alert("ログアウトできませんでした。");
      return;
    }
    localStorage.removeItem(
  "nanaconne_from_mypage"
);

    window.location.href = "./login.html";

  });

}

document.addEventListener("DOMContentLoaded", () => {

  const viewLinks = document.querySelectorAll("[data-view]");
  const views = document.querySelectorAll(".mypage-view");
  const sidebarLinks = document.querySelectorAll(".sidebar-link[data-view]");

  function showView(viewId) {

    // すべての画面を非表示
    views.forEach((view) => {
      view.classList.remove("active");
    });

    // 指定された画面を表示
    const targetView = document.getElementById(viewId);

    if (targetView) {
      targetView.classList.add("active");
    }


    // サイドメニューの選択状態を解除
    sidebarLinks.forEach((link) => {
      link.classList.remove("active");
    });


    // 表示している画面と同じメニューを青くする
    const activeSidebarLink =
      document.querySelector(
        `.sidebar-link[data-view="${viewId}"]`
      );

    if (activeSidebarLink) {
      activeSidebarLink.classList.add("active");
    }


    // 画面上部へ戻す
    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });

  }


  viewLinks.forEach((link) => {

    link.addEventListener("click", (event) => {

      event.preventDefault();

      const viewId = link.dataset.view;

      if (viewId) {
        showView(viewId);
      }

    });

  });

});
// =========================
// 保存済み書類
// =========================

let savedDocuments = [];


// =========================
// Supabaseから書類を取得
// =========================

async function loadDocuments() {

  const { data: userData, error: userError } =
    await supabaseClient.auth.getUser();

  if (userError || !userData.user) {
    console.error(
      "ログインユーザーを取得できませんでした。",
      userError
    );
    return;
  }

  const user = userData.user;


  const { data, error } =
    await supabaseClient
      .from("documents")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", {
        ascending: false
      });


  if (error) {
    console.error(
      "書類を取得できませんでした。",
      error
    );
    return;
  }


  savedDocuments = data || [];

  console.log(
    "保存済み書類:",
    savedDocuments
  );


  // 最近の書類
  renderRecentDocuments();

  // 書類一覧
  renderDocuments(savedDocuments);
}


// =========================
// 日付表示
// =========================

function formatDocumentDate(value) {

  if (!value) {
    return "-";
  }

  const date =
    new Date(`${value}T00:00:00`);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return (
    `${date.getFullYear()}/` +
    `${String(
      date.getMonth() + 1
    ).padStart(2, "0")}/` +
    `${String(
      date.getDate()
    ).padStart(2, "0")}`
  );
}


// =========================
// 金額表示
// =========================

function formatDocumentAmount(value) {

  const amount =
    Number(value) || 0;

  return `¥${amount.toLocaleString()}`;
}


// =========================
// 書類1行を作成
// =========================

function createDocumentRow(doc) {

  const row =
    document.createElement("div");

  row.className =
    "document-row";

  row.dataset.documentId =
    doc.id;


  const client =
    document.createElement("span");

  client.textContent =
    doc.client_name || "-";


  const number =
    document.createElement("span");

  number.textContent =
    doc.invoice_number || "-";


  const date =
    document.createElement("span");

  date.textContent =
    formatDocumentDate(
      doc.issue_date
    );


  const amount =
    document.createElement("span");

  amount.textContent =
    formatDocumentAmount(
      doc.total_amount
    );


  const actions =
    document.createElement("div");

  actions.className =
    "document-actions";


  // 表示ボタン
  const viewButton =
    document.createElement("button");

  viewButton.type =
    "button";

  viewButton.className =
    "view-document-button";

  viewButton.dataset.documentId =
    doc.id;

  viewButton.textContent =
    "表示";


  // 再発行ボタン
  const reissueButton =
    document.createElement("button");

  reissueButton.type =
    "button";

  reissueButton.className =
    "reissue-document-button";

  reissueButton.dataset.documentId =
    doc.id;

  reissueButton.textContent =
    "再発行";

    // 削除ボタン
const deleteButton =
  document.createElement("button");

deleteButton.type =
  "button";

deleteButton.className =
  "delete-document-button";

deleteButton.dataset.documentId =
  doc.id;

deleteButton.textContent =
  "削除";


  actions.append(
  viewButton,
  reissueButton,
  deleteButton
);


  row.append(
    client,
    number,
    date,
    amount,
    actions
  );


  return row;
}


// =========================
// 最近の書類
// =========================

function renderRecentDocuments() {

  const container =
    document.getElementById(
      "recent-documents-body"
    );

  if (!container) {
    return;
  }

  container.innerHTML = "";


  // 最新5件だけ
  const recent =
    savedDocuments.slice(0, 5);


  if (recent.length === 0) {

    const empty =
      document.createElement("div");

    empty.className =
      "empty-documents";

    empty.textContent =
      "まだ保存した書類はありません。";

    container.appendChild(empty);

    return;
  }


  recent.forEach((doc) => {

    container.appendChild(
      createDocumentRow(doc)
    );

  });
}

// =========================
// ページネーション
// =========================

const DOCUMENTS_PER_PAGE = 20;

let currentDocumentPage = 1;

let filteredDocuments = [];

// =========================
// 書類一覧を表示
// =========================

function renderDocuments(documents) {

  const container =
    document.getElementById(
      "documents-body"
    );

  if (!container) {
    return;
  }

  container.innerHTML = "";


  if (documents.length === 0) {

    const empty =
      document.createElement("div");

    empty.className =
      "empty-documents";

    empty.textContent =
      "該当する書類はありません。";

    container.appendChild(empty);

    return;
  }


  documents.forEach((doc) => {

    container.appendChild(
      createDocumentRow(doc)
    );

  });
}


// =========================
// 書類検索
// =========================

const documentSearchInput =
  document.getElementById(
    "document-search-input"
  );


if (documentSearchInput) {

  documentSearchInput.addEventListener(
    "input",
    applyDocumentFilters
  );

}


// =========================
// 書類並び替え
// =========================

const documentSortSelect =
  document.getElementById(
    "document-sort-select"
  );


if (documentSortSelect) {

  documentSortSelect.addEventListener(
    "change",
    applyDocumentFilters
  );

}


// =========================
// 検索・並び替えを反映
// =========================

function applyDocumentFilters() {

  const keyword =
    documentSearchInput
      ?.value
      .trim()
      .toLowerCase() || "";


  let documents =
    savedDocuments.filter((doc) => {

      const clientName =
        String(
          doc.client_name || ""
        ).toLowerCase();

      const invoiceNumber =
        String(
          doc.invoice_number || ""
        ).toLowerCase();


      return (
        clientName.includes(keyword) ||
        invoiceNumber.includes(keyword)
      );

    });


  const sortValue =
    documentSortSelect
      ?.value || "newest";


  documents =
    [...documents].sort((a, b) => {

      const dateA =
        new Date(
          a.issue_date ||
          a.created_at
        );

      const dateB =
        new Date(
          b.issue_date ||
          b.created_at
        );


      if (sortValue === "oldest") {
        return dateA - dateB;
      }

      return dateB - dateA;

    });


  filteredDocuments = documents;

currentDocumentPage = 1;

renderDocuments(
  filteredDocuments
);
}


// =========================
// 表示・再発行ボタン
// =========================

document.addEventListener("click", async (event) => {

  const viewButton =
    event.target.closest(
      ".view-document-button"
    );

  const reissueButton =
    event.target.closest(
      ".reissue-document-button"
    );

  const deleteButton =
    event.target.closest(
      ".delete-document-button"
    );


  // =========================
  // 表示
  // =========================

  if (viewButton) {

    const documentId =
      viewButton.dataset.documentId;

    const documentData =
      savedDocuments.find(
        (doc) =>
          String(doc.id) === String(documentId)
      );

    if (!documentData) {
      alert("書類データが見つかりません。");
      return;
    }

    localStorage.setItem(
      "nanaconne_invoice_draft",
      JSON.stringify(documentData.document_data)
    );

    localStorage.setItem(
      "nanaconne_view_document_id",
      documentId
    );

    localStorage.removeItem(
      "nanaconne_reissue_document_id"
    );

    window.location.href =
      "./complete.html?mode=view";

    return;
  }


// =========================
// 再発行
// =========================

if (reissueButton) {

  const documentId =
    reissueButton.dataset.documentId;

  const documentData =
    savedDocuments.find(
      (doc) =>
        String(doc.id) === String(documentId)
    );

  if (!documentData) {
    alert("書類データが見つかりません。");
    return;
  }

  // 保存済み請求書データを渡す
  localStorage.setItem(
    "nanaconne_invoice_draft",
    JSON.stringify(documentData.document_data)
  );

  // 再発行対象ID
  localStorage.setItem(
    "nanaconne_reissue_document_id",
    documentId
  );

  localStorage.removeItem(
    "nanaconne_view_document_id"
  );

  // auto=1 を付ける
  window.location.href =
    "./complete.html?mode=reissue&auto=1";

  return;
}
// =========================
// 削除
// =========================

if (deleteButton) {

  const documentId =
    deleteButton.dataset.documentId;

  const documentData =
    savedDocuments.find(
      (doc) =>
        String(doc.id) === String(documentId)
    );

  if (!documentData) {
    alert("書類データが見つかりません。");
    return;
  }

  const confirmed =
    window.confirm(
      `「${documentData.client_name || "この書類"}」を削除しますか？\n\n削除した書類は元に戻せません。`
    );

  if (!confirmed) {
    return;
  }

  const { data: userData, error: userError } =
    await supabaseClient.auth.getUser();

  if (userError || !userData.user) {
    console.error(
      "ログインユーザーを取得できませんでした。",
      userError
    );

    alert("ログイン情報を確認できませんでした。");
    return;
  }

  const targetId = Number(documentId);

console.log("削除対象ID:", targetId);
console.log("ログインユーザーID:", userData.user.id);

const { data: deletedDocuments, error } =
  await supabaseClient
    .from("documents")
    .delete()
    .eq("id", targetId)
    .select("id");

if (error) {
  console.error(
    "書類削除エラー:",
    error
  );

  alert("書類を削除できませんでした。");
  return;
}

// 本当に削除されたか確認
console.log(
  "削除されたデータ:",
  deletedDocuments
);

if (!deletedDocuments || deletedDocuments.length === 0) {
  console.error(
    "DELETEは実行されましたが、削除された行は0件です。"
  );

  alert(
    "削除対象の書類を削除できませんでした。"
  );

  return;
}

  // 画面上のデータからも削除
savedDocuments =
  savedDocuments.filter(
    (doc) =>
      String(doc.id) !== String(documentId)
  );

alert("書類を削除しました。");

// Supabaseから最新データを取り直す
await loadDocuments();

return;

  return;
}

});


// =========================
// 初期読み込み
// =========================

loadDocuments();