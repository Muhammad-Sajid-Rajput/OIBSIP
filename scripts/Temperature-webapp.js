function convertToFahrenheit(celsius) {
  return (celsius * 9 / 5) + 32;
}

function convertToCelsius(fahrenheit) {
  return (fahrenheit - 32) * 5 / 9;
}

function convertToKelvinFromCelsius(celsius) {
  return celsius + 273.15;
}

function convertToKelvinFromFahrenheit(fahrenheit) {
  return convertToCelsius(fahrenheit) + 273.15;
}

function convert() {
  const degree = parseFloat(document.getElementById('degree').value);
  const unit = document.getElementById('unit').value;
  const resultBox = document.getElementById('result');

  if (isNaN(degree)) {
    resultBox.innerText = "Please enter a valid number!";
    return;
  }

  let resultText = "";

  if (unit === 'C') {
    const fahrenheit = convertToFahrenheit(degree).toFixed(2);
    const kelvin = convertToKelvinFromCelsius(degree).toFixed(2);
    resultText = `${fahrenheit} °F  |  ${kelvin} K`;
  } else if (unit === 'F') {
    const celsius = convertToCelsius(degree).toFixed(2);
    const kelvin = convertToKelvinFromFahrenheit(degree).toFixed(2);
    resultText = `${celsius} °C  |  ${kelvin} K`;
  } else if (unit === 'K') {
    const celsius = (degree - 273.15).toFixed(2);
    const fahrenheit = convertToFahrenheit(celsius).toFixed(2);
    resultText = `${celsius} °C  |  ${fahrenheit} °F`;
  }

  resultBox.innerText = `Result: ${resultText}`;
}

document.querySelector('.convert').addEventListener('click',()=>{
  convert();
});