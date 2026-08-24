const pdfDownloadButton = document.getElementById('pdf-download-button');

if (pdfDownloadButton) {
  pdfDownloadButton.addEventListener('click', () => {

    const watermark = document.querySelector('.sample-watermark');

    if (watermark) {
      watermark.style.display = 'none';
    }

    window.print();

    setTimeout(() => {
      if (watermark) {
        watermark.style.display = 'block';
      }
    }, 1000);

  });
}