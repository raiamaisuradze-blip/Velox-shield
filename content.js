var WORDS = ['reject', 'decline', 'deny', 'არ ვეთანხმები', 'უარყოფა', 'cookie', 'ქუქი'];

function veloxFinalScan() {
  if (!chrome.runtime || !chrome.runtime.id) { return; }
  var all = document.getElementsByTagName('*');
  for (var i = 0; i < all.length; i++) {
    var el = all[i];
    var t = "";
    if (el.innerText) { t = el.innerText; }
    var lowText = t.trim().toLowerCase();

    if (lowText.indexOf('cookie') > -1) {
      if (lowText.length < 250) { el.style.display = 'none'; }
    }
    if (lowText.indexOf('ქუქი') > -1) {
      if (lowText.length < 250) { el.style.display = 'none'; }
    }

    if (lowText.length > 0 && lowText.length < 50) {
      var found = false;
      for (var j = 0; j < WORDS.length; j++) {
        if (lowText.indexOf(WORDS[j].toLowerCase()) > -1) { found = true; }
      }
      if (found == true) {
        var isPos = false;
        if (lowText.indexOf('accept') > -1) { isPos = true; }
        if (lowText.indexOf('agree') > -1) { isPos = true; }
        if (lowText == 'ვეთანხმები') { isPos = true; }
        if (isPos == false) { if (el.offsetWidth > 0) { el.click(); } }
      }
    }
  }
}

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  if (request.action == "deep_scan") {
    var all = document.getElementsByTagName('*');
    for (var i = 0; i < all.length; i++) {
      var el = all[i];
      var style = window.getComputedStyle(el);
      var pos = style.getPropertyValue('position');
      var txt = (el.innerText || "").toLowerCase();

      var isOverlay = false;
      if (pos == 'fixed') { isOverlay = true; }
      if (pos == 'absolute') { isOverlay = true; }

      if (isOverlay == true) {
        var hasText = false;
        if (txt.indexOf('cookie') > -1) { hasText = true; }
        if (txt.indexOf('ქუქი') > -1) { hasText = true; }
        if (txt.indexOf('consent') > -1) { hasText = true; }
        
        if (hasText == true) {
          el.style.setProperty('display', 'none', 'important');
        }
      }
    }
    document.body.style.setProperty('overflow', 'auto', 'important');
    document.documentElement.style.setProperty('overflow', 'auto', 'important');
  }
});

setInterval(function() {
  try { veloxFinalScan(); } catch (e) {}
}, 1000);