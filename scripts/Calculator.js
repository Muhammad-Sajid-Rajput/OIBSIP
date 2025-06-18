let expression = localStorage.getItem('expression') || '';
let lastAnswer = localStorage.getItem('lastAnswer') || '';
let isErrorState = false;
let justEvaluated = false;

displayExpression();

function appendToExpression(value) {
  if (isErrorState) {
    clearExpression();
    isErrorState = false;
  }

  if (justEvaluated && (/\d/.test(value) || value === '(')) {
    expression = '';
    justEvaluated = false;
  } else {
    justEvaluated = false;
  }
  // Prevent adding operators if expression is empty (except for - and √)
  if (['+', '*', '/', '%'].includes(value) && !expression) {
    return;
  }

  // Prevent adding operators right after another operator
  const lastChar = expression.slice(-1);
  if (['+', '*', '/', '%'].includes(value) && ['+', '-', '*', '/', '%'].includes(lastChar)) {
    // Allow changing the operator if last character is an operator
    if (['+', '*', '/', '%'].includes(lastChar)) {
      expression = expression.slice(0, -1);
    } else {
      return;
    }
  }

  // Prevent multiple decimal points in a number
  if (value === '.') {
    // Find the last number part, even if expression has operators
    const numberMatch = expression.match(/(\d*\.\d*|\d+)$/);
    const lastNumber = numberMatch ? numberMatch[0] : '';

    // Prevent multiple decimals in the current number
    if (lastNumber.includes('.')) {
      return;
    }
  }


  // Handle special cases
  if (value === '√') {
    expression += '√(';
  } else if (value === '(' && lastChar.match(/[0-9\)]/)) {
    expression += '*(';
  } else if (value.match(/[0-9\(]/) && lastChar === ')') {
    expression += '*' + value;
  } else {
    expression += value;
  }

  displayExpression();
  localStorage.setItem('expression', expression);
}

function evaluateExpression() {
  if (!expression || isErrorState) return;

  try {
    let expr = expression
      .replace(/√/g, 'sqrt')
      .replace(/ans/g, lastAnswer)
      .replace(/%/g, '/100*')
      .replace(/×/g, '*')
      .replace(/÷/g, '/');

    // Handle trailing operators
    if (['+', '-', '*', '/', '%'].includes(expr.slice(-1))) {
      expr = expr.slice(0, -1);
    }

    // Balance parentheses
    const openParens = (expr.match(/\(/g) || []).length;
    const closeParens = (expr.match(/\)/g) || []).length;
    expr += ')'.repeat(Math.max(0, openParens - closeParens));

    const result = math.evaluate(expr);
    expression = result.toString();
    lastAnswer = expression;
    justEvaluated=true;
    localStorage.setItem('lastAnswer', lastAnswer);
    localStorage.setItem('expression', expression);
  } catch (error) {
    handleError();
    return;
  }

  displayExpression();
}

function clearExpression() {
  expression = '';
  isErrorState = false;
  displayExpression();
  localStorage.setItem('expression', expression);
}

function deleteLastChar() {
  if (isErrorState) {
    clearExpression();
    return;
  }
  if (expression.endsWith('ans')) { expression = expression.slice(0, -3); }
  else { expression = expression.slice(0, -1); }

  displayExpression();
  localStorage.setItem('expression', expression);
}

function handleError() {
  expression = 'Error';
  isErrorState = true;
  displayExpression();
  setTimeout(() => {
    if (isErrorState) {
      clearExpression();
    }
  }, 1000);
}

function displayExpression() {
  const display = document.getElementById('display');
  if (display) {
    display.textContent = expression || '0';
    // Adjust font size for long expressions
    if (expression.length > 12) {
      display.style.fontSize = `${Math.max(20, 50 - (expression.length - 12) * 3)}px`;
    } else {
      display.style.fontSize = '50px';
    }
  }
}

function initEventListeners() {
  document.querySelectorAll('.js-button').forEach(button => {
    button.addEventListener('click', () => {
      const value = button.textContent;
      const action = button.dataset.action;

      if (action === 'enter') {
        evaluateExpression();
      } else if (action === 'clear') {
        clearExpression();
      } else if (action === 'del') {
        deleteLastChar();
      } else if (action === 'ans' && lastAnswer) {
        appendToExpression('ans');
      } else if (value) {
        appendToExpression(value);
      }
    });
  });

  document.addEventListener('keydown', (e) => {
    if (e.target.tagName === 'INPUT') return; // Skip if typing in an input field

    const key = e.key;

    if (/[0-9]/.test(key)) {
      appendToExpression(key);
    } else if (key === '.') {
      appendToExpression('.');
    } else if (key === '+' || key === '-' || key === '*' || key === '/') {
      appendToExpression(key);
    } else if (key === '%') {
      appendToExpression('%');
    } else if (key === '(' || key === ')') {
      appendToExpression(key);
    } else if (key === 'Enter') {
      evaluateExpression();
    } else if (key === 'Backspace') {
      deleteLastChar();
    } else if (key === 'Escape') {
      clearExpression();
    } else if (key === 'a' && lastAnswer) {
      appendToExpression('ans');
    } else if (key === 's') {
      appendToExpression('√');
    }
  });
}
initEventListeners();