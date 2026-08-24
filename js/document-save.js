const SUPABASE_URL = "https://sffwqzhtshtcbernkkqw.supabase.co";
const SUPABASE_KEY = "sb_publishable_fch9IIBoJIGXs0X1nT6jhA_zTe9Mp2F";

const supabaseClient = supabase.createClient(
  SUPABASE_URL,
  SUPABASE_KEY
);

const pdfButton = document.getElementById("pdf-download-button");

pdfButton.addEventListener("click", async () => {

  // ログイン中ユーザーを取得
  const { data: userData, error: userError } =
    await supabaseClient.auth.getUser();

  if (userError || !userData.user) {
    console.log("ログインユーザーなし");
    return;
  }

  const user = userData.user;


  // =========================
  // 入力内容を取得
  // =========================

  const clientName =
    document.getElementById("client-name").value.trim();

  const invoiceNumber =
    document.getElementById("invoice-number").value.trim();

  const issueDate =
    document.getElementById("issue-date").value;

  const dueDate =
    document.getElementById("payment-date").value;

  const grandTotalText =
    document.getElementById("preview-grand-total").textContent;

  const totalAmount =
    Number(grandTotalText.replace(/,/g, "")) || 0;


  // 明細をまとめる
  const items = [];

  document.querySelectorAll(".item-input-row").forEach((row) => {

    items.push({
      name: row.querySelector(".item-name")?.value || "",
      quantity: Number(
        row.querySelector(".item-qty")?.value || 0
      ),
      unit: row.querySelector(".item-unit")?.value || "",
      unit_price: Number(
        row.querySelector(".item-unit-price")?.value || 0
      )
    });

  });


  // 請求書全体データ
  const documentData = {

    client_name: clientName,
    invoice_number: invoiceNumber,
    issue_date: issueDate,
    due_date: dueDate,

    company: {
      name:
        document.getElementById("company-name").value.trim(),

      postcode:
        document.getElementById("company-postcode").value.trim(),

      address:
        document.getElementById("company-address").value.trim(),

      tel:
        document.getElementById("company-tel").value.trim(),

      registration_number:
        document.getElementById("company-number").value.trim()
    },

    bank: {
      name:
        document.getElementById("bank-name").value.trim(),

      branch:
        document.getElementById("bank-branch").value.trim(),

      account:
        document.getElementById("bank-account").value.trim()
    },

    note:
      document.getElementById("note").value,

    items: items,

    total_amount: totalAmount
  };


  // =========================
  // Supabaseへ保存
  // =========================

  const { error: insertError } =
    await supabaseClient
      .from("documents")
      .insert({
        user_id: user.id,
        client_name: clientName,
        invoice_number: invoiceNumber,
        issue_date: issueDate || null,
        total_amount: totalAmount,
        due_date: dueDate || null,
        document_data: documentData
      });


  if (insertError) {
    console.error("書類保存エラー:", insertError);
    alert("書類を保存できませんでした。");
    return;
  }

  console.log("書類を保存しました");

});