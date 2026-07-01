const stampUpload = document.getElementById('stamp-upload');
const stampPreview = document.getElementById('stamp-preview');
const invoiceStamp = document.querySelector('.invoice-stamp');

stampUpload.addEventListener('change', (e) => {
  const file = e.target.files[0];
  if (!file) return;

  const reader = new FileReader();

  reader.onload = (event) => {
    stampPreview.src = event.target.result;
    invoiceStamp.classList.add('has-image');
  };

  reader.readAsDataURL(file);
});