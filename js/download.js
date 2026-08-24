'use strict';


// ========================================
// URL情報
// ========================================

const params =
  new URLSearchParams(window.location.search);

const documentType =
  params.get('type') === 'estimate'
    ? 'estimate'
    : 'invoice';

const isEstimate =
  documentType === 'estimate';

const isMember =
  params.get('member') === '1';


// ========================================
// 要素
// ========================================

const title =
  document.getElementById('download-title');

const description =
  document.getElementById('download-description');

const downloadButton =
  document.getElementById('pdf-download-button');

const createAnotherButton =
  document.getElementById('create-another-button');

const returnButton =
  document.getElementById('return-button');


// ========================================
// 画面表示
// ========================================

if (isMember) {

  if (title) {
    title.textContent =
      '書類の作成が完了しました';
  }

} else {

  if (title) {
    title.textContent =
      'お支払いが完了しました';
  }

}


if (description) {

  description.textContent =
    isEstimate
      ? '見積書のPDFをダウンロードできます。'
      : '請求書のPDFをダウンロードできます.';

}


if (returnButton) {

  returnButton.textContent =
    isMember
      ? 'マイページへ戻る'
      : 'トップページへ戻る';

}


// ========================================
// PDFダウンロード
// ========================================

let isDownloading = false;


downloadButton?.addEventListener(
  'click',
  async () => {

    if (isDownloading) return;

    isDownloading = true;

    downloadButton.disabled = true;
    downloadButton.textContent =
      'PDFを作成しています...';


    try {

      // complete.htmlで保存した
      // 完成済み書類HTML
      const savedHtml =
        localStorage.getItem(
          'nanaconne_download_document'
        );


      if (!savedHtml) {

        alert(
          'ダウンロードする書類が見つかりませんでした。'
        );

        return;
      }


      // ========================================
      // PDF用の一時領域を作成
      // ========================================

      const wrapper =
        document.createElement('div');


      wrapper.style.position =
        'fixed';

      wrapper.style.left =
        '-10000px';

      wrapper.style.top =
        '0';

      wrapper.style.width =
        '720px';

      wrapper.style.background =
        '#ffffff';


      wrapper.innerHTML =
        savedHtml;


      document.body.appendChild(
        wrapper
      );


      const documentElement =
        wrapper.querySelector(
          '#complete-invoice'
        ) ||
        wrapper.querySelector(
          '.invoice-preview'
        );


      if (!documentElement) {

        wrapper.remove();

        alert(
          '書類データを読み込めませんでした。'
        );

        return;
      }


      // ========================================
      // SAMPLEを削除
      // ========================================

      const watermark =
        documentElement.querySelector(
          '.sample-watermark'
        );


      if (watermark) {
        watermark.remove();
      }


      // スマホ用transformが残らないようにする
      documentElement.style.transform =
        'none';

      documentElement.style.position =
        'relative';

      documentElement.style.left =
        'auto';

      documentElement.style.top =
        'auto';

      documentElement.style.margin =
        '0';

      documentElement.style.width =
        '720px';

      documentElement.style.minWidth =
        '720px';


      // ========================================
      // ファイル名
      // ========================================

      const draftKey =
        isEstimate
          ? 'nanaconne_estimate_draft'
          : 'nanaconne_invoice_draft';


      let fileName =
        isEstimate
          ? 'estimate'
          : 'invoice';


      const rawDraft =
        localStorage.getItem(
          draftKey
        );


      if (rawDraft) {

        try {

          const draft =
            JSON.parse(rawDraft);

          if (draft.invoiceNumber) {
            fileName =
              draft.invoiceNumber;
          }

        } catch (error) {

          console.warn(
            'ファイル名取得エラー',
            error
          );

        }

      }


      // ========================================
      // PDF生成
      // ========================================

      const options = {

        margin: 0,

        filename:
          `${fileName}.pdf`,

        image: {
          type: 'jpeg',
          quality: 0.98
        },

        html2canvas: {
          scale: 2,
          useCORS: true,
          scrollX: 0,
          scrollY: 0
        },

        jsPDF: {
          unit: 'mm',
          format: 'a4',
          orientation: 'portrait'
        }

      };


      await html2pdf()
        .set(options)
        .from(documentElement)
        .save();


      wrapper.remove();


    } catch (error) {

      console.error(
        'PDF生成エラー:',
        error
      );

      alert(
        'PDFを作成できませんでした。'
      );


    } finally {

      isDownloading = false;

      downloadButton.disabled =
        false;

      downloadButton.textContent =
        'PDFをダウンロード';

    }

  }
);


// ========================================
// 別の書類を作る
// ========================================

createAnotherButton?.addEventListener(
  'click',
  () => {

    window.location.href =
      './index.html';

  }
);


// ========================================
// 戻る
// ========================================

returnButton?.addEventListener(
  'click',
  () => {

    if (isMember) {

      window.location.href =
        './mypage.html';

    } else {

      window.location.href =
        './index.html';

    }

  }
);