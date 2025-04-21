
function calculateAffordability() {
  const income = parseFloat(document.getElementById('income').value);
  const debt = parseFloat(document.getElementById('debt').value);
  const condoFees = parseFloat(document.getElementById('condoFees').value);
  const heatingYearly = parseFloat(document.getElementById('heating').value);
  const heatingMonthly = heatingYearly / 12;
  const millRate = parseFloat(document.getElementById('millRate').value);
  const downPercent = parseFloat(document.getElementById('downPayment').value);
  const interestRateInput = parseFloat(document.getElementById('interestRate').value);

  const errorBox = document.getElementById('error');
  errorBox.textContent = '';

  if (isNaN(income) || isNaN(debt) || isNaN(downPercent) || isNaN(interestRateInput)) {
    errorBox.textContent = 'Please fill in all fields with valid numbers.';
    return;
  }

  const qualifyRate = Math.max(interestRateInput + 2, 5.25) / 100 / 12;
  const gdsLimit = income * 0.39;
  const tdsLimit = (income - debt) * 0.44;
  const amortization = 25 * 12;

  let payment, mortgage, purchasePrice, propertyTaxMonthly;
  let estimate = 0;

  // Loop to estimate based on GDS limit
  for (let i = 200000; i <= 1500000; i += 5000) {
    const downPayment = downPercent === 5
      ? (i <= 500000 ? i * 0.05 : 500000 * 0.05 + (i - 500000) * 0.10)
      : i * (downPercent / 100);
    const mortgageBase = i - downPayment;
    const insurance = downPercent < 20 ? mortgageBase * 0.04 : 0;
    const mortgageTotal = mortgageBase + insurance;
    const monthlyPI = mortgageTotal * qualifyRate / (1 - Math.pow(1 + qualifyRate, -amortization));
    const tax = i * millRate / 12;
    const totalHousing = monthlyPI + condoFees + heatingMonthly + tax;

    if (totalHousing <= gdsLimit && (totalHousing + debt) <= tdsLimit) {
      estimate = i;
      payment = monthlyPI;
      mortgage = mortgageBase;
      propertyTaxMonthly = tax;
    } else {
      break;
    }
  }

  const insurance = downPercent < 20 ? mortgage * 0.04 : 0;
  const totalMortgage = mortgage + insurance;
  const downPayment = estimate - mortgage;

  const format = val => val.toLocaleString('en-CA', { style: 'currency', currency: 'CAD' });
  document.getElementById('resultPayment').value = format(payment || 0);
  document.getElementById('resultPrice').value = format(estimate || 0);
  document.getElementById('resultDown').value = format(downPayment || 0);
  document.getElementById('resultInsurance').value = format(insurance || 0);
  document.getElementById('resultTotalMortgage').value = format(totalMortgage || 0);
}

function resetCalculator() {
  const fields = ['income', 'debt', 'condoFees', 'heating', 'interestRate',
                  'resultPayment', 'resultPrice', 'resultDown', 'resultInsurance', 'resultTotalMortgage'];
  fields.forEach(id => document.getElementById(id).value = '');
  document.getElementById('millRate').value = 0.0061803;
  document.getElementById('error').textContent = '';
}
