const SUPABASE_URL =
"https://sffwqzhtshtcbernkkqw.supabase.co";


const SUPABASE_KEY =
"sb_publishable_fch9IIBoJIGXs0X1nT6jhA_zTe9Mp2F";


const supabaseClient =
supabase.createClient(
  SUPABASE_URL,
  SUPABASE_KEY
);



const form =
document.getElementById(
"forgot-password-form"
);



form.addEventListener(
"submit",
async(event)=>{

event.preventDefault();


const email =
document
.getElementById(
"reset-email"
)
.value
.trim();



const { error } =
await supabaseClient
.auth
.resetPasswordForEmail(
email,
{
redirectTo:
"http://127.0.0.1:5500/HTML/reset-password.html"
}
);



if(error){

console.error(error);

alert(
"メール送信に失敗しました。\n"
+ error.message
);

return;

}



alert(
"パスワード再設定メールを送信しました。\nメールをご確認ください。"
);


});