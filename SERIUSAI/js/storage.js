/* storage.js — thin wrapper around localStorage with a namespaced key
   and safe JSON parse/stringify. Everything SeriusAI persists (theme,
   unlocked achievements, cart, fake session, egg counters) lives under
   a single root object so a full reset only needs one removeItem call. */

var SeriusStore = (function () {
  var ROOT_KEY = 'seriusai_state_v1';

  function defaults() {
    return {
      theme: null,
      session: null,
      unlocked: {},
      totalPoints: 0,
      cart: [],
      eggCounters: {
        logoClicks: 0,
        themeToggles: 0,
        panicClicks: 0,
        chatbotMessages: 0,
        clickTimestamps: []
      },
      visitedSections: [],
      firstVisit: true
    };
  }

  function read() {
    try {
      var raw = window.localStorage.getItem(ROOT_KEY);
      if (!raw) return defaults();
      var parsed = JSON.parse(raw);
      var merged = defaults();
      for (var k in parsed) {
        if (Object.prototype.hasOwnProperty.call(parsed, k)) merged[k] = parsed[k];
      }
      return merged;
    } catch (e) {
      return defaults();
    }
  }

  function write(state) {
    try {
      window.localStorage.setItem(ROOT_KEY, JSON.stringify(state));
      return true;
    } catch (e) {
      return false;
    }
  }

  var state = read();

  function save() { write(state); }

  return {
    get: function () { return state; },
    save: save,
    reset: function () {
      state = defaults();
      save();
    },
    set: function (key, value) {
      state[key] = value;
      save();
    },
    patch: function (partial) {
      for (var k in partial) {
        if (Object.prototype.hasOwnProperty.call(partial, k)) state[k] = partial[k];
      }
      save();
    }
  };
})();
