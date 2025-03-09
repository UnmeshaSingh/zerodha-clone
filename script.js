document.addEventListener("DOMContentLoaded", () => {
    // Dropdown functionality
    const dropdowns = document.querySelectorAll(".dropdown");

    dropdowns.forEach(dropdown => {
        const button = dropdown.querySelector(".dropdown-button");

        button.addEventListener("click", (event) => {
            event.stopPropagation();
            dropdown.classList.toggle("show"); // Toggle the visibility of the menu
        });

        // Close the dropdown menu when clicking outside
        document.addEventListener("click", (event) => {
            if (!dropdown.contains(event.target)) {
                dropdown.classList.remove("show");
            }
        });
    });

    // Search functionality
    const searchInput = document.querySelector(".search-bar input");
    const stockItems = document.querySelectorAll(".stock-item");

    searchInput.addEventListener("input", (event) => {
        const query = event.target.value.toLowerCase();

        stockItems.forEach(item => {
            const stockName = item.querySelector(".stock-name").textContent.toLowerCase();

            if (stockName.includes(query)) {
                item.style.display = "flex"; // Show the matching item
            } else {
                item.style.display = "none"; // Hide non-matching items
            }
        });
    });

    // Alarm button functionality
    const alarmButton = document.querySelector(".alarm-button");

    alarmButton.addEventListener("click", () => {
        alert("Alarm triggered! Check your stocks."); // Notify user
    });

    // Chart update functionality
    const symbolInput = document.querySelector(".symbol-input");
    const chartTitle = document.querySelector(".chart-title");
    let chart; // Declare chart variable globally

    // Function to fetch stock data dynamically from the backend
    const fetchStockData = async (symbol) => {
        try {
            const response = await fetch(`/update_chart?symbol=${symbol}`);
            if (response.ok) {
                const stockData = await response.json();

                // Check if data is empty
                if (stockData.length === 0) {
                    alert("Stock symbol not found. Please try again.");
                    return;
                }

                // Format data for Chart.js
                const chartData = stockData.map((data) => ({
                    x: data.date,
                    y: data.close,
                }));

                updateChart(chartData, symbol); // Update the chart with new data
            } else {
                alert("Error: Stock symbol not found.");
            }
        } catch (error) {
            console.error("Error fetching stock data:", error);
        }
    };

    // Function to update the chart
    const updateChart = (chartData, symbol) => {
        chartTitle.textContent = `Stock Chart for ${symbol.toUpperCase()}`;

        // Get the canvas context where the chart will be rendered
        const ctx = document.getElementById('candlestickChart').getContext('2d');

        // Destroy previous chart if it exists
        if (chart) {
            chart.destroy();
        }

        // Determine the chart type
        const chartType = document.querySelector(".dropdown-button").textContent.toLowerCase();

        // Render the selected type of chart
        chart = new Chart(ctx, {
            type: chartType, // Choose from 'bar', 'line', 'step', 'line' for mountain etc.
            data: {
                datasets: [
                    {
                        label: `Stock Prices for ${symbol.toUpperCase()}`,
                        data: chartData,
                        borderColor: "rgba(255,87,34,1)",
                        backgroundColor: chartType === 'bar' ? "rgba(255,87,34,0.1)" : "transparent",
                        fill: chartType === 'line' || chartType === 'step' || chartType === 'mountain',
                    },
                ],
            },
            options: {
                responsive: true,
                scales: {
                    x: {
                        type: "time", // Ensure this is set to 'time' for date-based x-axis
                        time: {
                            unit: "day",
                        },
                        title: {
                            display: true,
                            text: "Date",
                        },
                    },
                    y: {
                        title: {
                            display: true,
                            text: "Price",
                        },
                    },
                },
            },
        });
    };

    // Event listener for symbol input
    symbolInput.addEventListener("input", (event) => {
        const symbol = event.target.value.trim().toUpperCase();
        if (symbol) {
            fetchStockData(symbol); // Fetch data when the symbol is entered
        }
    });

    // Stock data for initial chart (for testing)
    const stockData = [
        { date: '2025-01-15', close: 150 },
        { date: '2025-01-16', close: 152 },
        { date: '2025-01-17', close: 157 },
        { date: '2025-01-18', close: 159 },
        { date: '2025-01-19', close: 161 },
    ];

    // Map stock data for Chart.js format
    const chartData = stockData.map((data) => ({
        x: data.date,
        y: data.close,
    }));

    // Initialize the chart with initial data
    updateChart(chartData, 'AAPL'); // Assuming 'AAPL' is the symbol for initial chart
});
