// Add the digits-only business WhatsApp number before launch, for example: 919876543210.
const BUSINESS_WHATSAPP = '';
const hamperSelect = document.getElementById('hamper-select');
const selectedSet = document.getElementById('selected-set');
const quantityInput = document.getElementById('quantity');
const messageInput = document.getElementById('message');
const messageCount = document.getElementById('message-count');
const recipientInput = document.getElementById('recipient-name');
const phoneName = document.getElementById('phone-name');
const qrImage = document.getElementById('qr-image');
const toast = document.getElementById('toast');
let selectedPalette = 'Pomegranate';

function getGreetingUrl() {
  const url = new URL('greeting.html', window.location.href);
  url.searchParams.set('to', recipientInput.value.trim() || 'A friend');
  return url.toString();
}

function updateGreetingPreview() {
  const name = recipientInput.value.trim() || 'A friend';
  phoneName.textContent = name;
  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=320x320&margin=12&data=${encodeURIComponent(getGreetingUrl())}`;
  qrImage.src = qrUrl;
}

function setHamper(name, scrollToBuilder = false) {
  hamperSelect.value = name;
  selectedSet.textContent = name;
  if (scrollToBuilder) {
    document.getElementById('builder').scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
}

function updateMessageCount() {
  messageCount.textContent = `${messageInput.value.length} / 180`;
}

function showToast(message) {
  toast.textContent = message;
  toast.classList.add('show');
  window.setTimeout(() => toast.classList.remove('show'), 3200);
}

document.querySelectorAll('.select-set').forEach((button) => {
  button.addEventListener('click', () => setHamper(button.dataset.set, true));
});

hamperSelect.addEventListener('change', () => setHamper(hamperSelect.value));

document.getElementById('quantity-minus').addEventListener('click', () => {
  quantityInput.value = Math.max(1, Number(quantityInput.value || 1) - 1);
});

document.getElementById('quantity-plus').addEventListener('click', () => {
  quantityInput.value = Math.min(10000, Number(quantityInput.value || 1) + 1);
});

quantityInput.addEventListener('change', () => {
  const value = Number(quantityInput.value || 1);
  quantityInput.value = Math.min(10000, Math.max(1, value));
});

document.querySelectorAll('.swatch').forEach((button) => {
  button.addEventListener('click', () => {
    selectedPalette = button.dataset.palette;
    document.querySelectorAll('.swatch').forEach((swatch) => {
      const active = swatch === button;
      swatch.classList.toggle('selected', active);
      swatch.setAttribute('aria-checked', String(active));
    });
  });
});

messageInput.addEventListener('input', updateMessageCount);
recipientInput.addEventListener('input', updateGreetingPreview);

document.getElementById('preview-greeting').addEventListener('click', () => {
  window.open(getGreetingUrl(), '_blank', 'noopener');
});

document.getElementById('copy-greeting').addEventListener('click', async () => {
  const link = getGreetingUrl();
  const status = document.getElementById('copy-status');
  try {
    await navigator.clipboard.writeText(link);
    status.textContent = 'Greeting link copied.';
  } catch {
    status.textContent = 'Open the preview to copy the link.';
  }
  window.setTimeout(() => { status.textContent = ''; }, 3000);
});

document.getElementById('order-form').addEventListener('submit', (event) => {
  event.preventDefault();
  const quantity = Math.max(1, Number(quantityInput.value || 1));
  const branding = document.getElementById('branding').checked ? 'Yes' : 'No';
  const note = messageInput.value.trim() || 'No gift note requested';
  const orderText = [
    'Hello Chocovibe, I would like to order a festive hamper.',
    `Hamper: ${hamperSelect.value}`,
    `Quantity: ${quantity}`,
    `Box palette: ${selectedPalette}`,
    `Branded sleeve/logo card: ${branding}`,
    `Gift note: ${note}`,
    `QR greeting link: ${getGreetingUrl()}`,
    'Please share availability and the final quote.'
  ].join('\n');
  const whatsappUrl = BUSINESS_WHATSAPP
    ? `https://wa.me/${BUSINESS_WHATSAPP}?text=${encodeURIComponent(orderText)}`
    : `https://wa.me/?text=${encodeURIComponent(orderText)}`;
  window.open(whatsappUrl, '_blank', 'noopener');
  showToast('Your WhatsApp message is ready.');
});

document.getElementById('corporate-order').addEventListener('click', () => {
  quantityInput.value = 25;
  document.getElementById('branding').checked = true;
  setHamper('Gilded Gratitude');
});

document.querySelector('.menu-toggle').addEventListener('click', (event) => {
  const nav = document.getElementById('main-nav');
  const isOpen = nav.classList.toggle('open');
  event.currentTarget.setAttribute('aria-expanded', String(isOpen));
});

document.querySelectorAll('.main-nav a').forEach((link) => {
  link.addEventListener('click', () => {
    document.getElementById('main-nav').classList.remove('open');
    document.querySelector('.menu-toggle').setAttribute('aria-expanded', 'false');
  });
});

updateMessageCount();
updateGreetingPreview();
