/* script.js — boot sequence. Loaded last, after every module file,
   so all globals (SeriusStore, SeriusUI, ...) already exist here. */

document.addEventListener('DOMContentLoaded', function () {
  if (window.SeriusUI) SeriusUI.init();
  if (window.SeriusAchievement) SeriusAchievement.init();
  if (window.SeriusEgg) SeriusEgg.init();
  if (window.SeriusPopup) SeriusPopup.init();
  if (window.SeriusLogin) SeriusLogin.init();
  if (window.SeriusChatbot) SeriusChatbot.init();
  if (window.SeriusMarket) SeriusMarket.init();
  if (window.SeriusFakeAdmin) SeriusFakeAdmin.init();
  if (window.SeriusNotify) SeriusNotify.startFeed(50000);

  var state = SeriusStore.get();
  if (state.firstVisit) {
    SeriusStore.set('firstVisit', false);
    setTimeout(function () {
      if (window.SeriusAchievement) SeriusAchievement.unlock('first_visit');
    }, 1200);
  }
});
