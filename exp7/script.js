let students = [];
let sortKey = "";
let sortAscending = true;

// Load JSON data using async/await
async function loadStudents() {
  const table = document.getElementById("studentTable");
  const errorMessage = document.getElementById("errorMessage");

  try {
    table.innerHTML = `
            <tr>
                <td colspan="12">Loading records...</td>
            </tr>
        `;

    errorMessage.textContent = "";

    const response = await fetch("students.json");

    // Handle HTTP errors
    if (!response.ok) {
      throw new Error(`HTTP Error: ${response.status}`);
    }

    const data = await response.json();

    // Validate JSON structure
    if (!Array.isArray(data.students)) {
      throw new Error("Invalid student data format.");
    }

    // Validate individual student records
    students = data.students.map((student) => {
      if (
        !student.enrollment ||
        !student.name ||
        !Number.isInteger(student.semester) ||
        student.semester < 1 ||
        student.semester > 8 ||
        !Array.isArray(student.marks) ||
        student.marks.length !== 5 ||
        student.marks.some(
          (mark) =>
            typeof mark !== "number" ||
            !Number.isFinite(mark) ||
            mark < 0 ||
            mark > 100,
        )
      ) {
        throw new Error("Invalid student record found.");
      }

      const total = student.marks.reduce((sum, mark) => sum + mark, 0);

      const percentage = total / 5;

      const result = student.marks.every((mark) => mark >= 40)
        ? "Pass"
        : "Fail";

      let grade;

      if (result === "Fail") {
        grade = "F";
      } else if (percentage >= 90) {
        grade = "A+";
      } else if (percentage >= 80) {
        grade = "A";
      } else if (percentage >= 70) {
        grade = "B";
      } else if (percentage >= 60) {
        grade = "C";
      } else if (percentage >= 50) {
        grade = "D";
      } else {
        grade = "E";
      }

      return {
        ...student,
        total,
        percentage,
        grade,
        result,
      };
    });

    // Update summary statistics
    calculateStatistics();

    // Display records
    displayStudents();
  } catch (error) {
    console.error("Error loading students:", error);

    table.innerHTML = `
            <tr>
                <td colspan="12">
                    Unable to load student records.
                </td>
            </tr>
        `;

    errorMessage.textContent = "Error: " + error.message;
  }
}

// Calculate class statistics
function calculateStatistics() {
  if (students.length === 0) {
    document.getElementById("classAverage").textContent = "N/A";

    document.getElementById("highestPercentage").textContent = "N/A";

    document.getElementById("lowestPercentage").textContent = "N/A";

    return;
  }

  const percentages = students.map((student) => student.percentage);

  const totalPercentage = percentages.reduce(
    (sum, percentage) => sum + percentage,
    0,
  );

  const average = totalPercentage / students.length;

  const highest = Math.max(...percentages);

  const lowest = Math.min(...percentages);

  document.getElementById("classAverage").textContent =
    average.toFixed(2) + "%";

  document.getElementById("highestPercentage").textContent =
    highest.toFixed(2) + "%";

  document.getElementById("lowestPercentage").textContent =
    lowest.toFixed(2) + "%";
}

// Display student records dynamically
function displayStudents() {
  const searchValue = document
    .getElementById("searchInput")
    .value.trim()
    .toLowerCase();

  const semesterValue = document.getElementById("semesterFilter").value;

  const resultValue = document.getElementById("resultFilter").value;

  const table = document.getElementById("studentTable");

  // Search and filter records
  let filteredStudents = students.filter((student) => {
    const matchesSearch =
      student.name.toLowerCase().includes(searchValue) ||
      student.enrollment.toLowerCase().includes(searchValue);

    const matchesSemester =
      semesterValue === "all" || student.semester === Number(semesterValue);

    const matchesResult =
      resultValue === "all" || student.result === resultValue;

    return matchesSearch && matchesSemester && matchesResult;
  });

  // Apply sorting
  if (sortKey) {
    filteredStudents.sort((a, b) => {
      let valueA = a[sortKey];
      let valueB = b[sortKey];

      if (typeof valueA === "string") {
        valueA = valueA.toLowerCase();
        valueB = valueB.toLowerCase();
      }

      if (valueA < valueB) {
        return sortAscending ? -1 : 1;
      }

      if (valueA > valueB) {
        return sortAscending ? 1 : -1;
      }

      return 0;
    });
  }

  // Handle empty results
  if (filteredStudents.length === 0) {
    table.innerHTML = `
            <tr>
                <td colspan="12">
                    No student records found.
                </td>
            </tr>
        `;

    document.getElementById("recordCount").textContent = "Showing 0 students";

    return;
  }

  // Generate table rows
  table.innerHTML = filteredStudents
    .map((student) => {
      const marksHTML = student.marks
        .map((mark) => `<td>${mark}</td>`)
        .join("");

      return `
            <tr>

                <td>${student.enrollment}</td>

                <td>${student.name}</td>

                <td>${student.semester}</td>

                ${marksHTML}

                <td>${student.total} / 500</td>

                <td>${student.percentage.toFixed(2)}%</td>

                <td>${student.grade}</td>

                <td class="${student.result.toLowerCase()}">
                    ${student.result}
                </td>

            </tr>
        `;
    })
    .join("");

  document.getElementById("recordCount").textContent =
    `Showing ${filteredStudents.length} of ${students.length} students`;
}

// Sort records when column headers are clicked
function sortTable(key) {
  if (sortKey === key) {
    sortAscending = !sortAscending;
  } else {
    sortKey = key;
    sortAscending = true;
  }

  displayStudents();
}

// Live search
document
  .getElementById("searchInput")
  .addEventListener("input", displayStudents);

// Semester filter
document
  .getElementById("semesterFilter")
  .addEventListener("change", displayStudents);

// Result filter
document
  .getElementById("resultFilter")
  .addEventListener("change", displayStudents);

// Load data when page opens
loadStudents();
