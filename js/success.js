document.addEventListener('DOMContentLoaded', () => {

  const orderNumber =
    document.getElementById('order-number');

  const paymentDate =
    document.getElementById('payment-date');

  const downloadButton =
    document.getElementById('download-button');


  /*
  ============================
  注文番号を仮表示
  ============================
  */

  const now = new Date();

  const randomNumber =
    Math.floor(
      1000 + Math.random() * 9000
    );

  const orderId =
    `NC-${now.getFullYear()}${String(
      now.getMonth() + 1
    ).padStart(2, '0')}${String(
      now.getDate()
    ).padStart(2, '0')}-${randomNumber}`;

  orderNumber.textContent = orderId;


  /*
  ============================
  決済日時
  ============================
  */

  const formattedDate =
    `${now.getFullYear()}年` +
    `${now.getMonth() + 1}月` +
    `${now.getDate()}日 ` +
    `${String(
      now.getHours()
    ).padStart(2, '0')}:` +
    `${String(
      now.getMinutes()
    ).padStart(2, '0')}`;

  paymentDate.textContent =
    formattedDate;


  /*
  ============================
  PDFダウンロードボタン
  ============================
  */

  downloadButton.addEventListener(
    'click',
    () => {

      /*
        今は仮処理。

        Stripe / PayPay連携後は
        ここで決済確認をしてから
        SAMPLEなしPDFを出力する。
      */

      alert(
        'SAMPLEなしの請求書を開きます。'
      );


      /*
        create.htmlへ戻す場合
      */

      window.location.href =
        './create.html?paid=true';

    }
  );

});