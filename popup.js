const toggle = document.getElementById('shieldToggle');
const statusText = document.getElementById('statusText');
const statusPill = document.querySelector('.status-pill');
const deepBtn = document.getElementById('deepScanBtn'); // ახალი ღილაკი

// ფუნქცია ვიზუალის განახლებისთვის (შენი ორიგინალი ლოგიკა)
function updateUI(isEnabled) {
  if (isEnabled) {
    statusText.innerText = 'SHIELD: ACTIVE';
    statusText.style.color = '#00d2ff';
    statusPill.style.borderColor = '#00d2ff';
    statusPill.style.boxShadow = '0 0 10px rgba(0, 210, 255, 0.3)';
  } else {
    statusText.innerText = 'SHIELD: OFF';
    statusText.style.color = '#ff4444';
    statusPill.style.borderColor = '#ff4444';
    statusPill.style.boxShadow = '0 0 10px rgba(255, 68, 68, 0.3)';
  }
}

// საწყისი მდგომარეობის ჩატვირთვა
chrome.storage.local.get(['isEnabled'], (result) => {
  const isEnabled = result.isEnabled !== false; 
  toggle.checked = isEnabled;
  updateUI(isEnabled);
});

// ჩამრთველის მართვა
toggle.addEventListener('change', () => {
  const isEnabled = toggle.checked;
  updateUI(isEnabled);
  chrome.storage.local.set({ isEnabled: isEnabled });
});

// * ახალი ფუნქცია: DEEP SCAN ბრძანების გაგზავნა *
deepBtn.addEventListener('click', () => {
  chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
    if (tabs[0]) {
      // ვუგზავნით სიგნალს content.js-ს
      chrome.tabs.sendMessage(tabs[0].id, {action: "deep_scan"});
      
      // ვიზუალური ეფექტი ღილაკზე დაჭერისას
      deepBtn.innerText = "SCANNING...";
      setTimeout(() => { deepBtn.innerText = "DEEP SCAN (FORCE)"; }, 1000);
    }
  });
});