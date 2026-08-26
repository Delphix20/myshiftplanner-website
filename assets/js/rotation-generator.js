(() => {
  const form = document.getElementById('rotation-generator-form');
  if (!form) return;

  const startInput = document.getElementById('rotation-start');
  const patternInput = document.getElementById('rotation-pattern');
  const shiftInput = document.getElementById('rotation-shift');
  const daysInput = document.getElementById('rotation-days');
  const preview = document.getElementById('rotation-preview');
  const summary = document.getElementById('rotation-summary');
  const printButton = document.getElementById('print-rotation');

  const patterns = {
    '223': [1, 1, 0, 0, 1, 1, 1, 0, 0, 1, 1, 0, 0, 0],
    '4on4off': [1, 1, 1, 1, 0, 0, 0, 0],
    '3on3off': [1, 1, 1, 0, 0, 0],
    'weekday': [1, 1, 1, 1, 1, 0, 0]
  };

  const names = {
    '223': '2-2-3 rotation',
    '4on4off': '4-on/4-off',
    '3on3off': '3-on/3-off',
    'weekday': 'five on, two off'
  };

  const toLocalDate = value => {
    const [year, month, day] = value.split('-').map(Number);
    return new Date(year, month - 1, day, 12);
  };

  const addDays = (date, amount) => {
    const next = new Date(date);
    next.setDate(next.getDate() + amount);
    return next;
  };

  const format = new Intl.DateTimeFormat(undefined, { weekday: 'short', month: 'short', day: 'numeric' });

  function render() {
    if (!startInput.value) return;
    const pattern = patterns[patternInput.value];
    const totalDays = Number(daysInput.value);
    const start = toLocalDate(startInput.value);
    const shiftLabel = shiftInput.value;
    let workdays = 0;

    preview.replaceChildren();
    for (let index = 0; index < totalDays; index += 1) {
      const date = addDays(start, index);
      const works = pattern[index % pattern.length] === 1;
      if (works) workdays += 1;

      const day = document.createElement('article');
      day.className = `rotation-day ${works ? 'rotation-day-work' : 'rotation-day-off'}`;
      const dateText = document.createElement('strong');
      dateText.textContent = format.format(date);
      const status = document.createElement('span');
      status.textContent = works ? shiftLabel : 'Off';
      day.append(dateText, status);
      preview.append(day);
    }
    summary.textContent = `${names[patternInput.value]}: ${workdays} workdays and ${totalDays - workdays} rest days in this ${totalDays}-day preview.`;
  }

  const now = new Date();
  startInput.value = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
  form.addEventListener('submit', event => { event.preventDefault(); render(); });
  form.addEventListener('change', render);
  printButton.addEventListener('click', () => window.print());
  render();
})();

