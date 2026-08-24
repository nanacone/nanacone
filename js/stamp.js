const stampUpload = document.getElementById('stamp-upload');
const stampPreview = document.getElementById('stamp-preview');
const invoiceStamp = document.querySelector('.invoice-stamp');
const removeStampButton = document.getElementById('remove-stamp-button');

stampUpload.addEventListener('change', (e) => {
  const file = e.target.files[0];
  if (!file) return;

  const reader = new FileReader();

  reader.onload = (event) => {
    const image = new Image();
    image.onload = () => {
      const canvas = document.createElement('canvas');
      const context = canvas.getContext('2d');
      if (!context) return;

      canvas.width = image.naturalWidth;
      canvas.height = image.naturalHeight;
      context.drawImage(image, 0, 0);

      const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
      const pixels = imageData.data;

      for (let index = 0; index < pixels.length; index += 4) {
        const red = pixels[index];
        const green = pixels[index + 1];
        const blue = pixels[index + 2];
        const lightestChannel = Math.min(red, green, blue);

        if (lightestChannel >= 235) {
          pixels[index + 3] = 0;
        } else if (lightestChannel > 200) {
          pixels[index + 3] = Math.round((235 - lightestChannel) / 35 * 255);
        }
      }

      context.putImageData(imageData, 0, 0);
      stampPreview.src = canvas.toDataURL('image/png');
      invoiceStamp.classList.add('has-image');
      if (typeof saveDraft === 'function') saveDraft();
    };
    image.src = event.target.result;
  };

  reader.readAsDataURL(file);
});

if (removeStampButton) {
  removeStampButton.addEventListener('click', () => {
    // clear file input
    if (stampUpload) stampUpload.value = '';
    // clear preview
    if (stampPreview) stampPreview.src = '';
    if (invoiceStamp) invoiceStamp.classList.remove('has-image');
    // persist draft change
    if (typeof saveDraft === 'function') saveDraft();
  });
}

// Ensure only the angle-stamp delete button remains: remove any other
// buttons with the same label that might have been added elsewhere.
window.addEventListener('DOMContentLoaded', () => {
  const buttons = Array.from(document.querySelectorAll('button'));
  buttons.forEach(btn => {
    if (btn === removeStampButton) return;
    const text = (btn.textContent || '').trim();
    if (text === '画像を削除') {
      btn.remove();
    }
  });
});