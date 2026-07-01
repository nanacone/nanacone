const pdfDownloadButton = document.getElementById('pdf-download-button');

pdfDownloadButton.addEventListener('click', () => {
  const watermark = document.querySelector('.sample-watermark');

  watermark.style.display = 'none';

  window.print();

  setTimeout(() => {
    watermark.style.display = 'block';
  }, 1000);
});