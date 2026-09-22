/**
 * Assistant Live Chat Widget Component
 */
import { INITIAL_CHAT_FAQS } from '../data/productsData.js';

export function setupChatWidget() {
  const triggerBtn = document.getElementById('chatTriggerBtn');
  const closeBtn = document.getElementById('closeChatBtn');
  const chatWindow = document.getElementById('chatWindow');
  const chatMessages = document.getElementById('chatMessages');
  const chatFaqChips = document.getElementById('chatFaqChips');
  const chatForm = document.getElementById('chatForm');
  const chatInput = document.getElementById('chatInput');

  if (!triggerBtn || !chatWindow) return;

  triggerBtn.addEventListener('click', () => {
    chatWindow.classList.toggle('open');
  });

  closeBtn?.addEventListener('click', () => {
    chatWindow.classList.remove('open');
  });

  // Render FAQ Chips
  if (chatFaqChips) {
    chatFaqChips.innerHTML = INITIAL_CHAT_FAQS.map(faq => `
      <button class="faq-chip" data-q="${faq.q}">${faq.q}</button>
    `).join('');

    chatFaqChips.querySelectorAll('.faq-chip').forEach(chip => {
      chip.addEventListener('click', () => {
        const question = chip.dataset.q;
        const faq = INITIAL_CHAT_FAQS.find(f => f.q === question);
        if (faq) {
          appendUserMsg(faq.q);
          setTimeout(() => appendBotMsg(faq.a), 400);
        }
      });
    });
  }

  chatForm?.addEventListener('submit', (e) => {
    e.preventDefault();
    const msg = chatInput.value.trim();
    if (!msg) return;

    appendUserMsg(msg);
    chatInput.value = '';

    setTimeout(() => {
      appendBotMsg("Thank you for reaching out! For instant order inquiries or bank transfer confirmations, please reference your Order ID (e.g. GJ-8942-PAY). Our studio representative will reply shortly.");
    }, 600);
  });

  function appendUserMsg(text) {
    const div = document.createElement('div');
    div.className = 'chat-msg user';
    div.textContent = text;
    chatMessages.appendChild(div);
    chatMessages.scrollTop = chatMessages.scrollHeight;
  }

  function appendBotMsg(text) {
    const div = document.createElement('div');
    div.className = 'chat-msg bot';
    div.innerHTML = text;
    chatMessages.appendChild(div);
    chatMessages.scrollTop = chatMessages.scrollHeight;
  }
}
