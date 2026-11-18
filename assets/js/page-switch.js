const nextPage = {
  'index.html': 'hack.html',
  'hack.html': 'leisure.html',
  'leisure.html': 'index.html',
};

window.addEventListener(
  'keydown',
  (event) => {
    if (!event.ctrlKey || event.metaKey || event.altKey || event.key !== 'Enter') return;

    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    const destination = nextPage[currentPage];
    if (!destination) return;

    event.preventDefault();
    event.stopImmediatePropagation();
    window.location.href = new URL(destination, window.location.href).href;
  },
  true,
);
