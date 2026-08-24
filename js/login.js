const SUPABASE_URL = "https://sffwqzhtshtcbernkkqw.supabase.co";
const SUPABASE_KEY = "sb_publishable_fch9IIBoJIGXs0X1nT6jhA_zTe9Mp2F";

const supabaseClient = supabase.createClient(
  SUPABASE_URL,
  SUPABASE_KEY
);

const loginForm = document.getElementById("login-form");

loginForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  const email = document
    .getElementById("login-email")
    .value
    .trim();

  const password = document
    .getElementById("login-password")
    .value;

  const loginButton = document.querySelector(".login-button");

  loginButton.disabled = true;
  loginButton.textContent = "ログイン中...";

  const { data, error } =
    await supabaseClient.auth.signInWithPassword({
      email: email,
      password: password
    });

  if (error) {
    console.error(error);

    alert(
      "ログインできませんでした。\nメールアドレスまたはパスワードを確認してください。"
    );

    loginButton.disabled = false;
    loginButton.textContent = "ログイン";

    return;
  }

  console.log("ログイン成功:", data);

  window.location.href = "./mypage.html";
});


const showPassword =
  document.getElementById("show-password");

const passwordInput =
  document.getElementById("login-password");


if(showPassword && passwordInput){

  showPassword.addEventListener(
    "change",
    () => {

      if(showPassword.checked){

        passwordInput.type = "text";

      }else{

        passwordInput.type = "password";

      }

    }
  );

}