const SUPABASE_URL = "https://sffwqzhtshtcbernkkqw.supabase.co";
const SUPABASE_KEY = "sb_publishable_fch9IIBoJIGXs0X1nT6jhA_zTe9Mp2F";

const supabaseClient = supabase.createClient(
  SUPABASE_URL,
  SUPABASE_KEY
);
const signupForm = document.getElementById("signup-form");

// パスワード表示・非表示
const showPassword = document.getElementById("show-password");
const passwordInput = document.getElementById("signup-password");
const passwordConfirmInput = document.getElementById("signup-password-confirm");
console.log(showPassword);
console.log(passwordInput);
console.log(passwordConfirmInput);

if (showPassword && passwordInput && passwordConfirmInput) {
  showPassword.addEventListener("change", () => {
    const type = showPassword.checked ? "text" : "password";

    passwordInput.type = type;
    passwordConfirmInput.type = type;
  });
}
signupForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  const name = document.getElementById("signup-name").value.trim();
  const email = document.getElementById("signup-email").value.trim();
  const password = document.getElementById("signup-password").value;
  const passwordConfirm = document.getElementById(
    "signup-password-confirm"
    
  ).value;

  // パスワード確認
  if (password !== passwordConfirm) {
    alert("パスワードが一致していません。");
    return;
  }

  // Supabaseにアカウント登録
 const { data, error } = await supabaseClient.auth.signUp({
  email: email,
  password: password,

  options: {
    emailRedirectTo:
  new URL(
    "./login.html",
    window.location.href
  ).href,

    data: {
      display_name: name
    }
  }
});

  if (error) {
    console.error(error);
    alert("アカウントを作成できませんでした。\n" + error.message);
    return;
  }

  console.log("登録成功:", data);

  alert(
    "確認メールを送信しました。\nメール内のリンクを押して登録を完了してください。"
  );
});

// =========================
// signup画面の戻るリンク切り替え
// =========================

const signupParams =
  new URLSearchParams(window.location.search);

const signupBackLink =
  document.getElementById("signup-back-link");

if (signupBackLink) {

  const from =
    signupParams.get("from");

  if (from === "payment") {

    signupBackLink.textContent =
      "← プラン選択に戻る";

    signupBackLink.href =
      "./payment.html";

  } else {

    signupBackLink.textContent =
      "← トップへ戻る";

    signupBackLink.href =
      "./top.html";

  }

}