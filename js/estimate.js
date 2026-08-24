const estimateValidDate =
  document.getElementById("estimate-valid-date");

const previewEstimateValidDate =
  document.getElementById("preview-estimate-valid-date");

const deliveryDate =
  document.getElementById("delivery-date");

const previewDeliveryDate =
  document.getElementById("preview-delivery-date");


if (estimateValidDate && previewEstimateValidDate) {
  estimateValidDate.addEventListener("input", () => {

    if (!estimateValidDate.value) {
      previewEstimateValidDate.textContent = "2026年○月○日";
      return;
    }

    const date = new Date(estimateValidDate.value);

    previewEstimateValidDate.textContent =
      `${date.getFullYear()}年${date.getMonth() + 1}月${date.getDate()}日`;
  });
}


if (deliveryDate && previewDeliveryDate) {
  deliveryDate.addEventListener("input", () => {

    previewDeliveryDate.textContent =
      deliveryDate.value || "ご発注後10営業日以内";

  });
}