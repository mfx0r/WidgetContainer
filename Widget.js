// Widget configuration
const categories = [
  { name: 'Groceries', defaultValue: 100, minValue: 0, maxValue: 1000, step: 10, percentage: 10 },
  { name: 'Alcohol', defaultValue: 100, minValue: 0, maxValue: 500, step: 10, percentage: 10 },
  { name: 'Fuel', defaultValue: 100, minValue: 0, maxValue: 500, step: 20, percentage: 15 },
  { name: 'Shopping', defaultValue: 100, minValue: 0, maxValue: 500, step: 10, percentage: 12 },
  { name: 'Gifts', defaultValue: 100, minValue: 0, maxValue: 200, step: 5, percentage: 5 },
  { name: 'Holidays', defaultValue: 100, minValue: 0, maxValue: 1000, step: 50, percentage: 20 },
  { name: 'Whitegoods', defaultValue: 100, minValue: 0, maxValue: 500, step: 10, percentage: 10 },
  { name: 'Tech & Electronics', defaultValue: 100, minValue: 0, maxValue: 1000, step: 20, percentage: 12 }
];

// Widget configuration
let chart; // Declare chart variable in a higher scope

// Generate slider HTML
function generateSliderHTML() {
  const slidersContainer = document.getElementById('sliders-container');

  for (let i = 0; i < categories.length; i++) {
    const category = categories[i];

    // Create slider input element
    const slider = document.createElement('input');
    slider.type = 'range';
    slider.id = `slider-${i}`;
    slider.className = 'form-control-range range__slider';
    slider.min = category.minValue;
    slider.max = category.maxValue;
    slider.step = category.step;
    slider.value = category.defaultValue;
    slider.addEventListener('input', () => {
      updateChart();
      updateSliderValue(i);
    });

// Add gradient to the slider
const sliderValue = slider.value;
const percent = ((sliderValue - category.minValue) / (category.maxValue - category.minValue)) * 100;
const gradient = `linear-gradient(90deg, #0e1a28 0%, #0e1a28 ${percent}%, #50AB99 ${percent}%, #71F4D2 100%)`;
slider.style.backgroundImage = gradient;
slider.style.backgroundSize = '100% 100%';

	
// Update the slider value display
function updateSliderValue(index) {
  const sliderValue = document.getElementById(`slider-${index}`).value;
  document.getElementById(`value-${index}`).textContent = '$'+sliderValue;

}

    // Create label element
    const label = document.createElement('label');
    label.htmlFor = `slider-${i}`;
    label.className = 'range__label';
    label.textContent = category.name;

    // Create value element
    const value = document.createElement('span');
    value.id = `value-${i}`;
    value.className = 'range__value-text';
    value.textContent = '$%%'+category.defaultValue;

    // Create slider container element
    const sliderContainer = document.createElement('div');
    sliderContainer.className = 'form-group range';
    sliderContainer.appendChild(label);
    sliderContainer.appendChild(slider);
    sliderContainer.appendChild(value);

    // Append slider container to the sliders container
    slidersContainer.appendChild(sliderContainer);
	

	
	
	
  }
}

// Update the chart based on the slider values
function updateChart() {
	const chartContainer = document.getElementById('chart-container');
	const weeksInYear = 52; // Assuming 52 weeks in a year
	const chartData = categories.map((category, index) => {
	const sliderValue = parseInt(document.getElementById(`slider-${index}`).value);
	const weeklySavings = sliderValue * (category.percentage / 100);
	const annualSavings = weeklySavings * weeksInYear;
  return annualSavings;
  });

  chart.updateSeries(chartData);
}

// Initialize the chart
function initializeChart() {
  const chartContainer = document.getElementById('chart-container');

  // Calculate the initial total savings
  let totalSavings = 0;
  for (let i = 0; i < categories.length; i++) {
    const category = categories[i];
    const categorySavings = (category.defaultValue * (category.percentage / 100)) * 52; // Multiply by 52 for weekly savings
    totalSavings += categorySavings;
  }

  const chartData = categories.map((category) => {
    return category.defaultValue * (category.percentage / 100);
  });
  const chartLabels = categories.map((category) => {
    return category.name;
  });

 const chartOptions = {
  series: chartData,
  chart: {
    width: 380,
    type: 'donut',
  },
  labels: chartLabels,
  plotOptions: {
    pie: {
      donut: {
        size: '70%',
        labels: {
          show: true,
          name: {
            show: true,
            fontSize: '16px',
            fontFamily: 'Arial, sans-serif',
            color: undefined,
            offsetY: -10,
          },
          value: {
			  
            show: true,
            fontSize: '20px',
            fontFamily: 'Arial, sans-serif',
            color: undefined,
            offsetY: 10,
            formatter: function (val) {
              return 'Save $'+val;
            },
          },
          total: {
            show: true,
            label: 'Annual Saving',
            formatter: function (w) {
              const total = w.globals.seriesTotals.reduce((a, b) => a + b, 0);
              return '$'+total.toFixed(2);
            },
            fontSize: '18px',
            fontFamily: 'Arial, sans-serif',
            fontWeight: 'bold',
            color: '#000',
            offsetY: 0,
          },
        },
      },
	  
    },
  },
  legend: {
    show: false, // Hide the legend
  },
  responsive: [
    {
      breakpoint: 480,
      options: {
        chart: {
          width: 300,
        },
      			  minAngleToShowLabel: 0,
	  },
    },
  ],
};


  chart = new ApexCharts(chartContainer, chartOptions);
  chart.render();
}

// Initialize the widget
function initializeWidget() {
  generateSliderHTML();
  initializeChart();
}

// Initialize the widget when the DOM is ready
document.addEventListener('DOMContentLoaded', initializeWidget);
