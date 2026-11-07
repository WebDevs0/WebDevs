/* ResolveIT Staff Dashboard - JavaScript */


// Test that JavaScript is connected
console.log("ResolveIT JavaScript is connected!");

// Wait until the HTML page is fully loaded

document.addEventListener("DOMContentLoaded", function () {
//Sprint 2 - Backend API configuration //
const API_URL = "http://localhost:5001/api/tickets";

// Retrive submitted tickets from Jordan's backend
async function loadTickets() {
    console.log("Attempting to load tickets from backend...");

    try {
        const response = await fetch(API_URL);

        if (!response.ok) {
            throw new Error("Unable to retrieve tickets");
        }

        const tickets = await response.json();

        //verifies that the response contains arrays//
        if (!Array.isArray(tickets)) {
            throw new Error("Invalid ticket data received");
        }

        console.log("Tickets retrieved successfully:", tickets);
        renderTickets(tickets);
        updateTicketCounts();
        filterTickets();

    } catch (error) {
        console.error("Ticket API connection failed:", error);
        console.log("Keeping sample tickets until backend is ready.");

    }

}
function renderTickets(tickets) {
    const tableBody = document.getElementById("ticket-table-body");

    const categoryNames = {
        account: "Account Access",
        network: "Wi-Fi Connection",
        hardware: "Hardware Issue",
        other: "Other"
    };

    const statusNames = {
        open: "Open",
        in_progress: "In Progress",
        resolved: "Resolved",
        closed: "Closed"
    };

    const rows = document.createDocumentFragment();

    tickets.forEach(function(ticket) {
        const row = document.createElement("tr");

        const cells = [
            `TKT-${String(ticket.id).padStart(3, "0")}`,
            ticket.requester_name,
            categoryNames[ticket.category] || ticket.category,
            ticket.priority.charAt(0).toUpperCase() + ticket.priority.slice(1),
            statusNames[ticket.status] || ticket.status,
            new Date(ticket.created_at).toLocaleDateString()
        ];

        cells.forEach(function(value, index) {
            const cell = document.createElement("td");

            if (index === 3) {
                const badge = document.createElement("span");
                badge.className = "priority " + ticket.priority.toLowerCase();
                badge.textContent = value;
                cell.appendChild(badge);

            } else if (index === 4) {
                const badge = document.createElement("span");

                const statusClass = {
                    open: "open",
                    assigned: "assigned",
                    in_progress: "progress",
                    resolved: "resolved",
                    closed: "closed",
                };
                badge.className = "status " + (statusClass[ticket.status] || "");
                badge.textContent = value;
                cell.appendChild(badge);
            } else {
                cell.textContent = value;
            }


               
            row.appendChild(cell);
        });
        rows.appendChild(row);
    });
    // Replace a sample of tickets only after new rows are prepared //
    tableBody.replaceChildren(rows);

}
    // Get the search bar and filter dropdowns
    const searchInput = document.getElementById("ticket-search");
    const statusFilter = document.getElementById("status-filter");
    const priorityFilter = document.getElementById("priority-filter");
    const categoryFilter = document.getElementById("category-filter");

    // Get all ticket rows from the table
    function getTicketRows() {
        return document.querySelectorAll(".ticket-table tbody tr");
    }

    // Function to filter the tickets
    function filterTickets() {

        const searchValue = searchInput.value.toLowerCase().trim();
        const selectedStatus = statusFilter.value;
        const selectedPriority = priorityFilter.value;
        const selectedCategory = categoryFilter.value;

        getTicketRows().forEach(function (row) {

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

        getTicketRows().forEach(function (row) {
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

    loadTickets();

});