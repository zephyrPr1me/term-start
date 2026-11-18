const button = document.querySelector('#breath-button');
const status = document.querySelector('#breath-status');
const breather = document.querySelector('.leisure-break');
const progress = document.querySelector('#breath-progress');
const clock = document.querySelector('#clock');
const date = document.querySelector('#date');
const quickLinks = new Map(
  Array.from(document.querySelectorAll('[data-hotkey]'), (link) => [link.dataset.hotkey, link]),
);

let intervalId = null;
let remaining = 60;
let phase = 'inhale';

function updateClock() {
  const now = new Date();
  clock.textContent = new Intl.DateTimeFormat('ru-RU', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  }).format(now);
  date.textContent = new Intl.DateTimeFormat('ru-RU', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  }).format(now);
}

function finishBreathing() {
  window.clearInterval(intervalId);
  intervalId = null;
  remaining = 60;
  breather.classList.remove('is-active', 'is-exhale');
  progress.style.width = '0';
  status.textContent = 'готов к паузе';
  button.textContent = 'начать';
}

function startBreathing() {
  if (intervalId) {
    finishBreathing();
    return;
  }

  remaining = 60;
  phase = 'inhale';
  breather.classList.add('is-active');
  status.textContent = 'вдохни';
  button.textContent = 'остановить';

  intervalId = window.setInterval(() => {
    remaining -= 1;
    progress.style.width = `${((60 - remaining) / 60) * 100}%`;
    if (remaining <= 0) {
      finishBreathing();
      status.textContent = 'хорошо. не спеши.';
      return;
    }

    phase = phase === 'inhale' ? 'exhale' : 'inhale';
    breather.classList.toggle('is-exhale', phase === 'exhale');
    status.textContent = phase === 'inhale' ? 'вдохни' : 'выдохни';
  }, 4000);
}

button.addEventListener('click', startBreathing);
document.addEventListener('keydown', (event) => {
  const tag = event.target && event.target.tagName;
  if (event.ctrlKey || event.metaKey || event.altKey || ['INPUT', 'TEXTAREA', 'SELECT'].includes(tag))
    return;

  const link = quickLinks.get(event.key);
  if (!link) return;
  event.preventDefault();
  link.click();
});

updateClock();
window.setInterval(updateClock, 1000);
