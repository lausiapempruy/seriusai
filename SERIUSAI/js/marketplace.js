/* marketplace.js — renders the absurd product catalog and keeps a
   real (if pointless) cart in localStorage via SeriusStore. */

var SeriusMarket = (function () {
  function formatIDR(n) {
    if (n === 0) return 'Gratis';
    return 'Rp' + n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  }

  function updateCartIndicator() {
    var state = SeriusStore.get();
    var countEl = document.getElementById('cartCount');
    if (countEl) countEl.textContent = state.cart.length;
  }

  function addToCart(product) {
    var state = SeriusStore.get();
    state.cart.push(product.id);
    SeriusStore.save();
    updateCartIndicator();
    if (window.SeriusAchievement) SeriusAchievement.unlock('marketplace_buy');
    if (window.SeriusNotify) {
      SeriusNotify.show(product.emoji, 'Berhasil "Dibeli"', product.name + ' telah ditambahkan ke keranjang khayalan Anda.');
    }
  }

  function render(products) {
    var grid = document.getElementById('marketGrid');
    if (!grid) return;
    grid.innerHTML = '';
    products.forEach(function (p) {
      var card = document.createElement('div');
      card.className = 'card product-card';
      card.innerHTML =
        (p.tag ? '<span class="tag tag-primary">' + p.tag + '</span>' : '') +
        '<div class="product-emoji">' + p.emoji + '</div>' +
        '<h3>' + p.name + '</h3>' +
        '<p>' + p.desc + '</p>' +
        '<div class="product-price">' + formatIDR(p.price) + (p.price > 0 ? ' <small>/ selamanya</small>' : '') + '</div>' +
        '<button class="btn btn-primary btn-block" type="button">Beli Sekarang</button>';
      card.querySelector('button').addEventListener('click', function () { addToCart(p); });
      grid.appendChild(card);
    });
  }

  function init() {
    var grid = document.getElementById('marketGrid');
    if (!grid) return;
    updateCartIndicator();
    fetch('data/fake-products.json')
      .then(function (r) { return r.json(); })
      .then(render)
      .catch(function () {
        grid.innerHTML = '<p style="color:var(--color-text-dim)">Katalog sedang serius memuat ulang. Coba refresh halaman.</p>';
      });
  }

  return { init: init };
})();
