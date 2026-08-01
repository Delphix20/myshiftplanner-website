document.addEventListener('DOMContentLoaded', () => {
  const form = document.querySelector('#shift-pay-form');
  if (!form) return;

  const fields = {
    currency: form.querySelector('#currency'),
    baseRate: form.querySelector('#base-rate'),
    regularHours: form.querySelector('#regular-hours'),
    overtimeHours: form.querySelector('#overtime-hours'),
    overtimeMultiplier: form.querySelector('#overtime-multiplier'),
    nightHours: form.querySelector('#night-hours'),
    nightDifferential: form.querySelector('#night-differential'),
    weekendHours: form.querySelector('#weekend-hours'),
    weekendDifferential: form.querySelector('#weekend-differential'),
    bonus: form.querySelector('#bonus')
  };

  const output = {
    regular: document.querySelector('#regular-pay-result'),
    overtime: document.querySelector('#overtime-pay-result'),
    differentials: document.querySelector('#differentials-result'),
    bonus: document.querySelector('#bonus-result'),
    total: document.querySelector('#total-result')
  };

  const numberValue = (field) => Math.max(0, Number.parseFloat(field.value) || 0);

  const formatMoney = (value) => {
    try {
      return new Intl.NumberFormat(undefined, {
        style: 'currency',
        currency: fields.currency.value,
        maximumFractionDigits: 2
      }).format(value);
    } catch {
      return `${value.toFixed(2)} ${fields.currency.value}`;
    }
  };

  const calculate = () => {
    const baseRate = numberValue(fields.baseRate);
    const regularPay = numberValue(fields.regularHours) * baseRate;
    const overtimePay = numberValue(fields.overtimeHours) * baseRate * numberValue(fields.overtimeMultiplier);
    const nightPay = numberValue(fields.nightHours) * numberValue(fields.nightDifferential);
    const weekendPay = numberValue(fields.weekendHours) * numberValue(fields.weekendDifferential);
    const bonusPay = numberValue(fields.bonus);
    const differentialsPay = nightPay + weekendPay;
    const total = regularPay + overtimePay + differentialsPay + bonusPay;

    output.regular.textContent = formatMoney(regularPay);
    output.overtime.textContent = formatMoney(overtimePay);
    output.differentials.textContent = formatMoney(differentialsPay);
    output.bonus.textContent = formatMoney(bonusPay);
    output.total.textContent = formatMoney(total);
  };

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    calculate();
  });
  form.addEventListener('input', calculate);
  form.addEventListener('reset', () => window.setTimeout(calculate, 0));
  calculate();
});
