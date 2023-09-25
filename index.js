let calc = [];
let dot = false;
let leadingZero = false;
let calculated = false;

const OPERATORS = ["+", "-", "*", "/"];

const calculate = () => {
  let result = "&nbsp";
  try {
    if (calc.length > 0) {
      let lastItem = calc.at(-1);
      if (OPERATORS.includes(lastItem)) {
        calc.pop();
      }
      result = eval(calc.join(""));
    }

    if (result === Infinity || result === -Infinity) {
      result = "Error";
    }
  } catch (error) {
    result = "Error";
  }
  return result;
};

const addNumber = (number) => {
  let lastItem = calc.at(-1);

  if (leadingZero) {
    calc.pop();
  }

  if (!OPERATORS.includes(lastItem) && calculated) {
    calc = [];
    calculated = dot = false;
  }

  calc.push(number);
  if (
    number === "0" &&
    (OPERATORS.includes(lastItem) || lastItem === undefined || leadingZero)
  ) {
    leadingZero = true;
  } else {
    leadingZero = false;
  }
  updateDisplay();
};

const addOperator = (operator) => {
  let lastItem = calc.at(-1);
  if (calc.length === 0 && operator !== "-") {
    return;
  }

  if (OPERATORS.includes(lastItem)) {
    if (calc.length === 1) {
      calc.pop();
      updateDisplay();
      return;
    }
    if (
      lastItem === "-" &&
      (calc.at(-2) === "*" || calc.at(-2) === "/") &&
      operator !== "-"
    ) {
      calc.pop();
      calc.pop();
    } else if (!(["*", "/"].includes(lastItem) && operator === "-")) {
      calc.pop();
    }
  }
  calc.push(operator);

  leadingZero = dot = calculated = false;

  updateDisplay();
};

const addDot = () => {
  let lastItem = calc.at(-1);
  let lastStmt = calc
    .join("")
    .split(/[+\-*\/]/)
    .at(-1);
  if (OPERATORS.includes(lastItem) || lastItem === undefined) {
    calc.push(0);
  } else if (dot || lastStmt.indexOf(".") > -1) {
    return;
  }

  calc.push(".");
  dot = true;
  leadingZero = false;
  updateDisplay();
};

const clearEntry = () => {
  let clearedItem = calc.at(-1);
  if (clearedItem === ".") {
    dot = false;
    leadingZero = true;
  }

  calc.pop();
  updateDisplay();
};

const getResult = () => {
  let result = calculate();
  leadingZero = false;
  calculated = true;
  document.getElementById("display").innerHTML = result;
  if (!isNaN(result)) {
    if (("" + result).indexOf(".") === -1) {
      dot = false;
    }
    calc = [result];
  } else {
    calc = [];
    dot = false;
  }
};

const updateDisplay = () => {
  let lastItem = calc.at(-1);
  document.getElementById("display").innerHTML = calc.join("");
  if (!(calculated || OPERATORS.includes(lastItem) || lastItem === undefined)) {
    document.getElementById("result").innerHTML = calculate();
  } else if (calc.length === 0) {
    document.getElementById("display").innerHTML = "&nbsp;";
    document.getElementById("result").innerHTML = "&nbsp;";
  }
};

const isInt = (str) => !isNaN(str) && !isNaN(parseInt(str));
document.querySelectorAll("div.number").forEach((div) => {
  div.addEventListener("click", function () {
    addNumber(div.innerHTML);
  });
});

document.querySelectorAll("div.operator").forEach((div) => {
  div.addEventListener("click", function () {
    addOperator(div.innerHTML);
  });
});

document.getElementById("dot").addEventListener("click", function () {
  addDot();
});

document.getElementById("ce").addEventListener("click", function () {
  clearEntry();
});

document.getElementById("ac").addEventListener("click", function () {
  calc = [];
  dot = calculated = leadingZero = false;
  updateDisplay();
});

document.getElementById("equal").addEventListener("click", () => {
  getResult();
});

document.addEventListener("keydown", (e) => {
  if (OPERATORS.includes(e.key)) {
    addOperator(e.key);
  } else if (e.key === ".") {
    addDot();
  } else if (!isNaN(e.key) && e.code !== "Space") {
    addNumber(e.key);
  } else if (e.key === "Backspace") {
    clearEntry();
  } else if (e.key === "Enter") {
    getResult();
  } else if (e.key === "Escape") {
    calc = [];
    dot = calculated = leadingZero = false;
    updateDisplay();
  }
});
