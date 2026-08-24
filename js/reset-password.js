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
"reset-form"
);



form.addEventListener(
"submit",
async(e)=>{


e.preventDefault();


const password =
document
.getElementById("new-password")
.value;



const {error} =
await supabaseClient.auth.updateUser({

password: password

});



if(error){

alert(
"変更できませんでした\n"
+error.message
);

return;

}


alert(
"パスワードを変更しました"
);


window.location.href =
"./login.html";


});
// パスワード表示・非表示

const showPassword =
document.getElementById("show-password");


const password =
document.getElementById("new-password");


if(showPassword && password){

  showPassword.addEventListener("change",()=>{

    password.type =
    showPassword.checked
    ? "text"
    : "password";

  });

}
