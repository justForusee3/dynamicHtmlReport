// Global
const fetchData = fetch('29-2-2024-16-19.json')
    .then(response => {
        if (!response.ok) {
            
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .catch(error => {
        console.error('Error fetching data:', error);
        throw error;
    });

// Use Fetched Data 
document.addEventListener('DOMContentLoaded', () => {
    fetchData.then(data => {
        // Device Details
        const deviceDetails = data.find(obj => obj.hasOwnProperty('Device Details'));
        const deviceInfo = deviceDetails ? deviceDetails['Device Details'] : null;

        // Execution time
        const executionTimeData = data.find(obj => obj.hasOwnProperty('Execution Time'));

        // summary data
        const summaryData = data.find(obj => obj.hasOwnProperty('Summary Data'));
        // console.log("Hmmmmmmm",summaryData);
        const summaryInfo = summaryData ? summaryData['Summary Data'] : null;

        // Display data
        if (deviceInfo) {
            document.getElementById('deviceName').textContent = deviceInfo['Device Name'];
            document.getElementById('ipAddress').textContent = deviceInfo['IP Address'];
            document.getElementById('imageName').textContent = deviceInfo['Image Name'];
            document.getElementById('yoctoVersion').textContent = deviceInfo['Yocto Version'];
            document.getElementById('uptime').textContent = deviceInfo['Uptime'];
        }

        if (executionTimeData) {
            document.getElementById('executionTime').textContent = executionTimeData['Execution Time'];
        }

        if (summaryInfo) {
            document.getElementById('total').textContent = summaryInfo['TOTAL'];
            document.getElementById('passed').textContent = summaryInfo['Passed'];
            document.getElementById('failed').textContent = summaryInfo['Failed'];
            document.getElementById('na').textContent = summaryInfo['NA'];
        }

        const arrayOfChart = data.find(obj => obj.hasOwnProperty('Chart Data'))['Chart Data'];
        // console.log(arrayOfChart)

        var labelData = []
        var passedData = []
        var failedData = []
        var naData = []
        var totalData = []

        arrayOfChart.forEach(element => {
            labelData.push(element['Module'])
            failedData.push(element['Failed'])
            passedData.push(element['Passed'])
            naData.push(element['NA'])
            totalData.push(element['Total'])
        });

        // console.log(labelData)

        var myChart = new Chart(myContext, {
            type: 'bar',
            data: {
                labels: labelData,
                datasets: [{
                    label: 'Passed',
                    backgroundColor: "#5BC866",
                    data: passedData,
                }, {
                    label: 'NA',
                    backgroundColor: "#FFB237",
                    data: naData,
                },
                {
                    label: 'Failed',
                    backgroundColor: "#F87878",
                    data: failedData,
                }],
            },
            options: {
                plugins: {
                    title: {
                        display: true,
                        text: 'Stacked Bar chart for pollution status'
                    },
                },
                scales: {
                    x: {
                        stacked: true,
                    },
                    y: {
                        stacked: true
                    }
                }
            }

        });

        
        var data = {
            pass: summaryInfo['Passed'],
            fail: summaryInfo['Failed'],
            na: summaryInfo['NA']
        };

        var myPieChart = new Chart(ctx, {
            type: 'pie',
            data: {
                labels: ['Passed', 'Failed', 'NA'],
                datasets: [{
                    data: [data.pass, data.fail, data.na],
                    backgroundColor: ['#5BC866', '#F87878', '#FFB237'],
                }]
            },
            options: {
                responsive: false,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'right',
                        labels: {
                            usePointStyle: true,
                            boxWidth: 10
                        }
                    },
                    datalabels: {
                        display: 'auto',
                        color: 'black',
                        formatter: (value, context) => {
                            const dataset = context.chart.data.datasets[0];
                            const dataIntegers = dataset.data.map(Number);
                            const total = dataIntegers.reduce((acc, currentValue) => acc + currentValue, 0);
                            const percentage = ((value / total) * 100).toFixed(2);
                            return percentage !== '0.00' ? percentage + '%' : '';
                        },
                    },
                }
            },
            plugins: [ChartDataLabels]
        });
    });
});


/////////////////////////////Detailed View////////////////////////////////////////////
//Populate the table with fetched JSON data
async function populateTable() {
    try {
        const jsonData = await fetchData; // Fetch JSON data from global Variable
        // console.log('Fetched JSON data:', jsonData); // Check For Log 

        if (!Array.isArray(jsonData) || jsonData.length === 0) {
            throw new Error('JSON data is not an array or empty');
        }

        var tableBody = document.querySelector('#example tbody');
        var summaryTableData = jsonData.find(item => item.SummaryTableData)?.SummaryTableData; // Access Property for SummaryTableData
        // console.log('SummaryTableData:', summaryTableData); // Check SummaryTableData array

        if (!Array.isArray(summaryTableData) || summaryTableData.length === 0) {
            throw new Error('SummaryTableData array Not present or empty');
        }

        summaryTableData.forEach(function(plugin) {
            var row = document.createElement('tr');

            var pluginCell = document.createElement('td');
            pluginCell.textContent = plugin.Plugin;
            row.appendChild(pluginCell);

            var passedCell = document.createElement('td');
            passedCell.textContent = Array.isArray(plugin.Passed) ? plugin.Passed.join(', ') : plugin.Passed;
            row.appendChild(passedCell);

            var failedCell = document.createElement('td');
            failedCell.textContent = Array.isArray(plugin.Failed) ? plugin.Failed.join(', ') : plugin.Failed;
            row.appendChild(failedCell);

            var naCell = document.createElement('td');
            naCell.textContent = plugin.NA;
            row.appendChild(naCell);

            tableBody.appendChild(row);
        });
    } catch (error) {
        console.error('Error populating table:', error);
    }
}

// Call the function to populate the table
populateTable();

/////////////////////////////End////////////////////////////////////////////


/////

// To-Do
// click on any plugin Data will going to manipulate
// --> Test Case Buttons
// --> Test Case Details
// --> Test Case Steps

// Click Event Listner On Plugin Options then Click Event Listner on Test Case Buttons
// So When, Cick on Test Case Details , The initial data or by default data will render ex. DeviceInfo
// Next When i click on another plugin data should render based on clicking
// next when i click on test Case Buttons ---> By default first Button should be clicked
// 


////////////////////////////////END////////////////////////////////////////


//////////////////////////TESTING CODE For PLUGIN KEY////////////////////////////////

function populatePluginOptionsFromJson(dataPromise, selectElementSelector) {
    dataPromise.then(jsonData => {
        console.log('JSON data:', jsonData); // Check JSON data 

        // Access the first item in the array, which should contain "Execution Details"
        const firstItem = jsonData[0];
        if (!firstItem || !firstItem.hasOwnProperty('Execution Details')) {
            console.error('Execution Details not found in JSON data.');
            return; // Exit if not found
        }

        const executionDetailsObject = firstItem['Execution Details'];
        console.log("Execution Details:", executionDetailsObject); // Log the Execution Details object

        const selectElement = document.querySelector(selectElementSelector);

        // If Existing Options Exist, Then Clear
        selectElement.innerHTML = '';

        // Iterate through the keys of the first object - Execution Details
        const keys = Object.keys(executionDetailsObject[0] || {});
        console.log("KEYSSSS",executionDetailsObject[0]);

       
        keys.forEach(key => {
            const option = document.createElement('option');
            option.textContent = key; // Use key as textContent for option
            selectElement.appendChild(option);
        });


        


    }).catch(error => {
        console.error('Error populating options:', error);
    });
}

// Call the populatePluginOptionsFromJson
populatePluginOptionsFromJson(fetchData, '.services-select');




/////////APR

  


////////END APR

///////////////////////////////////////////////////////////////////////////
// PIE CHART & GRAPH CHART 

$('.services-select').select2();

new DataTable('#example');
document.getElementById("tcDetails1").click();
// Get the element with id="defaultOpen" and click on it
document.getElementById("defaultOpen").click();


// Create a new div element
var myStackedBarChartDiv = document.createElement("div");
myStackedBarChartDiv.id = 'myStackedBarChartDiv';

// Get the div container
var chartContainer = document.getElementById('pieChartBox');
// Get the canvas element
var canvas = chartContainer.querySelector('#pieChart');

// Set the canvas dimensions to match the div container
canvas.width = chartContainer.offsetWidth;
canvas.height = chartContainer.offsetHeight;

var ctx = canvas.getContext('2d');

// dropdown to select the number of bars to show on chart
let currentPage = 1;
let barsPerPage = 10;

const barsPerPageSelect = document.createElement('select');
barsPerPageSelect.id = 'barsPerPageSelect';
barsPerPageSelect.innerHTML = [10, 15, 20, 25].map(function (value) {
    return '<option value="' + value + '">' + value + ' Bars Per Page</option>';
}).join('');

barsPerPageSelect.addEventListener('change', function () {
    barsPerPage = parseInt(this.value, 10);
    currentPage = 1; // Reset current page when bars per page changes
    updateChart();
});
// Append the select element to the chartsContainer
myStackedBarChartDiv.prepend(barsPerPageSelect);
var barChartCountSelection = document.getElementById("myStackedBarChartCount");
barChartCountSelection.appendChild(myStackedBarChartDiv);
// Get the drawing context on the canvas 
var myContext = document.getElementById("stackedChartID").getContext('2d');

function openTab(evt, tabName) {
    var i, tabcontent, tablinks;
    tabcontent = document.getElementsByClassName("tabcontent");
    for (i = 0; i < tabcontent.length; i++) {
        tabcontent[i].style.display = "none";
    }
    tablinks = document.getElementsByClassName("tablinks");
    for (i = 0; i < tablinks.length; i++) {
        tablinks[i].className = tablinks[i].className.replace(" active", "");
    }
    document.getElementById(tabName).style.display = "block";
    evt.currentTarget.className += " active";
}

function openTabContent(evt, tabName) {
    var i, tabcontent, tablinks;
    tabcontent = document.getElementsByClassName("dtabcontent");
    for (i = 0; i < tabcontent.length; i++) {
        tabcontent[i].style.display = "none";
    }
    tablinks = document.getElementsByClassName("tabClinks");
    for (i = 0; i < tablinks.length; i++) {
        tablinks[i].className = tablinks[i].className.replace(" active", "");
    }
    document.getElementById(tabName).style.display = "block";
    evt.currentTarget.className += " active";
}


// Function to get current UTC date in the specified format
function getCurrentUTCDate() {
  const dateTime = new Date();
  const day = dateTime.getUTCDate();
  const month = dateTime.getUTCMonth() + 1; // Months are zero-based, ADD 1
  const year = dateTime.getUTCFullYear();
  const hours = dateTime.getHours();
  const minutes = dateTime.getMinutes();

  return `${day}-${month}-${year} ${hours}:${minutes}`;
}

// Function to update the HTML element with the current Date & Time
function updateDateTime() {
  const formattedDateTime = getCurrentUTCDate();
  document.getElementById('datetime').innerHTML = formattedDateTime;
}

// Call the updateDateTime function
updateDateTime();

