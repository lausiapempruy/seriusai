/* chatbot.js — SIGMA-1, a fully client-side "AI" that picks replies
   from a small keyword-matched pool loaded from data/dialogs.json.
   No network calls beyond that JSON fetch; every reply is genuine
   canned logic, not a placeholder. */

var SeriusChatbot = (function () {
  var dialogs = { greetings: [], fallback: [], keywords: {} };
  var messageCount = 0;
  var opened = false;

  function pick(arr) { return arr[Math.floor(Math.random() * arr.length)]; }

  function reply(userText) {
    var lower = userText.toLowerCase();
    var keys = Object.keys(dialogs.keywords);
    for (var i = 0; i < keys.length; i++) {
      if (lower.indexOf(keys[i]) !== -1) {
        return pick(dialogs.keywords[keys[i]]);
      }
    }
    return pick(dialogs.fallback.length ? dialogs.fallback : ['Menarik. Coba lagi nanti.']);
  }

  function appendMessage(body, sender) {
    var log = document.getElementById('chatbotBody');
    if (!log) return;
    var div = document.createElement('div');
    div.className = 'chat-msg ' + sender;
    div.textContent = body;
    log.appendChild(div);
    log.scrollTop = log.scrollHeight;
  }

  function showTyping() {
    var log = document.getElementById('chatbotBody');
    if (!log) return null;
    var div = document.createElement('div');
    div.className = 'chat-msg bot typing-dots';
    div.innerHTML = '<span></span><span></span><span></span>';
    log.appendChild(div);
    log.scrollTop = log.scrollHeight;
    return div;
  }

  function handleSend() {
    var input = document.getElementById('chatbotInput');
    if (!input) return;
    var text = input.value.trim();
    if (!text) return;
    appendMessage(text, 'user');
    input.value = '';
    messageCount++;
    if (messageCount >= 10 && window.SeriusAchievement) SeriusAchievement.unlock('chatbot_spam');

    var typing = showTyping();
    var delay = 500 + Math.random() * 700;
    setTimeout(function () {
      if (typing && typing.parentNode) typing.parentNode.removeChild(typing);
      appendMessage(reply(text), 'bot');
    }, delay);
  }

  function toggleWindow() {
    var win = document.getElementById('chatbotWindow');
    if (!win) return;
    var isOpen = win.classList.toggle('is-open');
    if (isOpen && !opened) {
      opened = true;
      if (window.SeriusAchievement) SeriusAchievement.unlock('chatbot_open');
      appendMessage(dialogs.greetings.length ? pick(dialogs.greetings) : 'Halo!', 'bot');
    }
  }

  function loadDialogs() {
    fetch('data/dialogs.json')
      .then(function (r) { return r.json(); })
      .then(function (data) { dialogs = data; })
      .catch(function () { /* fallback pool stays empty; reply() still works */ });
  }

  function init() {
    loadDialogs();
    var launcher = document.getElementById('chatbotLauncher');
    var sendBtn = document.getElementById('chatbotSend');
    var input = document.getElementById('chatbotInput');
    if (launcher) launcher.addEventListener('click', toggleWindow);
    if (sendBtn) sendBtn.addEventListener('click', handleSend);
    if (input) input.addEventListener('keydown', function (e) {
      if (e.key === 'Enter') handleSend();
    });
  }

  return { init: init };
})();
