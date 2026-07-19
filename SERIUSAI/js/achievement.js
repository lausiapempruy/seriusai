/* achievement.js — the scoring layer that ties every easter egg
   together. Any module can call SeriusAchievement.unlock('id') and
   this file handles dedupe, persistence, the popup toast, the grid
   render on the Achievements section, and the progress bar. */

var SeriusAchievement = (function () {
  var list = [];
  var popupEl = null;
  var popupTimer = null;

  function ensurePopup() {
    if (popupEl) return popupEl;
    popupEl = document.createElement('div');
    popupEl.className = 'unlock-popup';
    popupEl.innerHTML =
      '<div class="u-icon">🏆</div>' +
      '<div><div class="u-title">Achievement Terbuka</div><div class="u-name"></div></div>';
    document.body.appendChild(popupEl);
    return popupEl;
  }

  function showPopup(item) {
    var el = ensurePopup();
    el.querySelector('.u-icon').textContent = item.icon;
    el.querySelector('.u-name').textContent = item.title;
    el.classList.add('is-visible');
    if (popupTimer) clearTimeout(popupTimer);
    popupTimer = setTimeout(function () { el.classList.remove('is-visible'); }, 4200);
  }

  function renderGrid() {
    var grid = document.getElementById('achievementGrid');
    if (!grid || !list.length) return;
    var state = SeriusStore.get();
    grid.innerHTML = '';
    var unlockedCount = 0;
    list.forEach(function (item) {
      var isUnlocked = !!state.unlocked[item.id];
      if (isUnlocked) unlockedCount++;
      var div = document.createElement('div');
      div.className = 'ach-item ' + (isUnlocked ? 'unlocked' : 'locked');
      div.innerHTML =
        '<div class="ach-icon">' + item.icon + '</div>' +
        '<div><h4>' + (isUnlocked ? item.title : '???') + '</h4>' +
        '<p>' + (isUnlocked ? item.desc : 'Belum terbuka. Terus jelajahi SeriusAI.') + '</p>' +
        '<span class="ach-points">+' + item.points + ' poin</span></div>';
      grid.appendChild(div);
    });
    var bar = document.getElementById('achProgressFill');
    var counter = document.getElementById('achCounter');
    var pct = Math.round((unlockedCount / list.length) * 100);
    if (bar) bar.style.width = pct + '%';
    if (counter) counter.textContent = unlockedCount + ' / ' + list.length + ' terbuka · ' + state.totalPoints + ' poin';

    if (unlockedCount === list.length) {
      unlock('completionist');
    }
  }

  function unlock(id) {
    var state = SeriusStore.get();
    if (state.unlocked[id]) return false;
    var item = null;
    for (var i = 0; i < list.length; i++) { if (list[i].id === id) { item = list[i]; break; } }
    if (!item) return false;

    state.unlocked[id] = Date.now();
    state.totalPoints = (state.totalPoints || 0) + item.points;
    SeriusStore.save();

    showPopup(item);
    if (window.SeriusNotify) {
      SeriusNotify.show(item.icon, 'Achievement: ' + item.title, item.desc, 5200);
    }
    renderGrid();
    return true;
  }

  function init() {
    fetch('data/achievements.json')
      .then(function (r) { return r.json(); })
      .then(function (data) {
        list = data;
        renderGrid();
      })
      .catch(function () { list = []; });
  }

  return { init: init, unlock: unlock, renderGrid: renderGrid };
})();
