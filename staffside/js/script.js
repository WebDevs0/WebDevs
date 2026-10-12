/* ResolveIT Staff Dashboard - JavaScript */


// Test that JavaScript is connected
console.log("ResolveIT JavaScript is connected!");

// Wait until the HTML page is fully loaded

document.addEventListener("DOMContentLoaded", function () {
    // Get the search bar and filter dropdowns
    const searchInput = document.getElementById("ticket-search");
    const statusFilter = document.getElementById("status-filter");
    const priorityFilter = document.getElementById("priority-filter");
    const categoryFilter = document.getElementById("category-filter");

    // Get all ticket rows from the table
    const ticketRows = document.querySelectorAll(".ticket-table tbody tr");

    // Function to filter the tickets
    function filterTickets() {

        const searchValue = searchInput.value.toLowerCase().trim();
        const selectedStatus = statusFilter.value;
        const selectedPriority = priorityFilter.value;
        const selectedCategory = categoryFilter.value;

        ticketRows.forEach(function (row) {

            // Get ticket information from each column
            const ticketID = row.cells[0].textContent.toLowerCase();
            const requester = row.cells[1].textContent.toLowerCase();
            const category = row.cells[2].textContent.trim();
            const priority = row.cells[3].textContent.trim();
            const status = row.cells[4].textContent.trim();

            // Check search input
            const matchesSearch =
                ticketID.includes(searchValue) ||
                requester.includes(searchValue);
            
            // Check dropdown selections
            const matchesStatus =
                selectedStatus === "all" || status === selectedStatus;

            const matchesPriority =
                selectedPriority === "all" || priority === selectedPriority;

            const matchesCategory =
                selectedCategory === "all" || category === selectedCategory;

            // Show or hide the row
            if (
                matchesSearch &&
                matchesStatus &&
                matchesPriority &&
                matchesCategory 
            ) {
                row.hidden = false;
            } else {
                row.hidden = true;
            }
        
        });
    }

    // Run filtering whenever the user searches or changes a filter
    searchInput.addEventListener("input", filterTickets);
    statusFilter.addEventListener("change", filterTickets);
    priorityFilter.addEventListener("change", filterTickets);
    categoryFilter.addEventListener("change", filterTickets);

    // Update dashboard summary counts
    function updateTicketCounts() {
        let openCount = 0;
        let assignedCount = 0;
        let progressCount = 0;
        let resolvedCount = 0;

        ticketRows.forEach(function (row) {
            const status = row.cells[4].textContent.trim();

            if (status === "Open") {
                openCount++;
            } else if (status === "Assigned") {
                assignedCount++;
            } else if (status === "In Progress") {
                progressCount++;
            } else if (status === "Resolved") {
                resolvedCount++;
            }

        });

        document.getElementById("open-count").textContent = openCount;
        document.getElementById("assigned-count").textContent = assignedCount;
        document.getElementById("progress-count").textContent = progressCount;
        document.getElementById("resolved-count").textContent = resolvedCount;

    }
    // Calculate counts when the dashboard loads
    updateTicketCounts();
    console.log("Resolved count:", document.getElementById("resolved-count").textContent);

});