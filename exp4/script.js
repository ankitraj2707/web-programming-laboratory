/**
 * Student Marks Calculator & Dynamic Analytics
 * Passing criteria: Each subject score >= 40.
 */

const PASS_MARK = 40;
const STORAGE_KEY = "student_records_db";

// Global Array to store student objects
let students = [];

// DOM References
const marksForm = document.getElementById("marksForm");
const statusMessage = document.getElementById("statusMessage");
const recordsTableBody = document.getElementById("recordsTableBody");
const emptyTableMessage = document.getElementById("emptyTableMessage");

const totalStudentsCount = document.getElementById("totalStudentsCount");
const classAverageValue = document.getElementById("classAverageValue");
const classTopperValue = document.getElementById("classTopperValue");
const clearRecordsBtn = document.getElementById("clearRecordsBtn");

// -------------------------------------------------------------
// Separate Calculation Functions
// -------------------------------------------------------------

/**
 * Calculates the total aggregate score of an array of numbers.
 * @param {number[]} marksArray
 * @returns {number}
 */
function calculateTotal(marksArray) {
  return marksArray.reduce((acc, curr) => acc + curr, 0);
}

/**
 * Computes the percentage based on total marks and number of subjects.
 * @param {number} totalMarks
 * @param {number} subjectCount
 * @returns {number}
 */
function calculatePercentage(totalMarks, subjectCount) {
  return parseFloat(((totalMarks / (subjectCount * 100)) * 100).toFixed(2));
}

/**
 * Determines grade (O, A+, A, B+, B, C, F) based on percentage and pass status.
 * Declares 'F' if any subject is below PASS_MARK.
 * @param {number} percentage
 * @param {boolean} hasFailedSubject
 * @returns {string}
 */
function calculateGrade(percentage, hasFailedSubject) {
  if (hasFailedSubject) return "F";
  if (percentage >= 90) return "O";
  if (percentage >= 80) return "A+";
  if (percentage >= 70) return "A";
  if (percentage >= 60) return "B+";
  if (percentage >= 50) return "B";
  if (percentage >= 40) return "C";
  return "F";
}

/**
 * Validates individual mark between 0 and 100.
 * @param {number} val
 * @returns {boolean}
 */
function isValidMark(val) {
  return !isNaN(val) && val >= 0 && val <= 100;
}

// -------------------------------------------------------------
// Persistence via localStorage
// -------------------------------------------------------------

function saveToLocalStorage() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(students));
}

function loadFromLocalStorage() {
  const savedData = localStorage.getItem(STORAGE_KEY);
  if (savedData) {
    try {
      students = JSON.parse(savedData);
    } catch (e) {
      students = [];
    }
  } else {
    students = [];
  }
}

// -------------------------------------------------------------
// DOM Updates & Rendering
// -------------------------------------------------------------

/**
 * Re-renders the entire table body dynamically.
 */
function renderTable() {
  recordsTableBody.innerHTML = "";

  if (students.length === 0) {
    emptyTableMessage.style.display = "block";
    return;
  }

  emptyTableMessage.style.display = "none";

  students.forEach((student, index) => {
    const row = document.createElement("tr");

    row.innerHTML = `
      <td><strong>${escapeHtml(student.enrollmentNo)}</strong></td>
      <td>${escapeHtml(student.name)}</td>
      <td>${student.marks[0]}</td>
      <td>${student.marks[1]}</td>
      <td>${student.marks[2]}</td>
      <td>${student.marks[3]}</td>
      <td>${student.marks[4]}</td>
      <td><strong>${student.total}</strong></td>
      <td>${student.percentage}%</td>
      <td><strong>${student.grade}</strong></td>
      <td>
        <span class="badge ${student.isPass ? "badge-pass" : "badge-fail"}">
          ${student.isPass ? "PASS" : "FAIL"}
        </span>
      </td>
      <td>
        <button class="btn-delete-row" data-index="${index}" title="Delete record">Delete</button>
      </td>
    `;

    recordsTableBody.appendChild(row);
  });
}

/**
 * Calculates and updates class average and topper metrics.
 */
function updateAnalytics() {
  totalStudentsCount.textContent = students.length;

  if (students.length === 0) {
    classAverageValue.textContent = "0.00%";
    classTopperValue.textContent = "None";
    return;
  }

  // Calculate Class Average Percentage
  const sumPercentage = students.reduce(
    (acc, curr) => acc + curr.percentage,
    0,
  );
  const classAvg = (sumPercentage / students.length).toFixed(2);
  classAverageValue.textContent = `${classAvg}%`;

  // Find Topper (Highest Total). If multiple share top score, picks the highest scorer who passed.
  const topper = students.reduce((prev, curr) => {
    return curr.total > prev.total ? curr : prev;
  }, students[0]);

  classTopperValue.textContent = `${topper.name} (${topper.total}/500 - ${topper.percentage}%)`;
}

/**
 * Displays user feedback inside the form container without using alert().
 */
function showStatus(message, isError = false) {
  statusMessage.textContent = message;
  statusMessage.className = `status-msg ${isError ? "error" : "success"}`;
}

function clearStatus() {
  statusMessage.textContent = "";
  statusMessage.className = "status-msg";
}

// Basic XSS escaping for safe innerHTML injection
function escapeHtml(str) {
  return str.replace(
    /[&<>'"]/g,
    (tag) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;" })[
        tag
      ] || tag,
  );
}

// -------------------------------------------------------------
// Event Handlers
// -------------------------------------------------------------

marksForm.addEventListener("submit", function (e) {
  e.preventDefault();
  clearStatus();

  const nameInput = document.getElementById("studentName").value.trim();
  const enrollInput = document.getElementById("enrollmentNo").value.trim();

  const m1 = parseFloat(document.getElementById("sub1").value);
  const m2 = parseFloat(document.getElementById("sub2").value);
  const m3 = parseFloat(document.getElementById("sub3").value);
  const m4 = parseFloat(document.getElementById("sub4").value);
  const m5 = parseFloat(document.getElementById("sub5").value);

  const marksList = [m1, m2, m3, m4, m5];

  // Validation
  if (!nameInput || !enrollInput) {
    showStatus(
      "Please enter both the student name and enrollment number.",
      true,
    );
    return;
  }

  for (let i = 0; i < marksList.length; i++) {
    if (!isValidMark(marksList[i])) {
      showStatus(
        `Subject ${i + 1} mark is invalid. Please enter a value between 0 and 100.`,
        true,
      );
      return;
    }
  }

  // Check for duplicate enrollment number
  const isDuplicate = students.some(
    (s) => s.enrollmentNo.toLowerCase() === enrollInput.toLowerCase(),
  );
  if (isDuplicate) {
    showStatus(
      `Enrollment number "${enrollInput}" already exists in records.`,
      true,
    );
    return;
  }

  // Calculations using separate functions
  const total = calculateTotal(marksList);
  const percentage = calculatePercentage(total, marksList.length);
  const hasFailedSubject = marksList.some((m) => m < PASS_MARK);
  const grade = calculateGrade(percentage, hasFailedSubject);
  const isPass = !hasFailedSubject;

  // Build Student Object
  const newStudent = {
    name: nameInput,
    enrollmentNo: enrollInput,
    marks: marksList,
    total: total,
    percentage: percentage,
    grade: grade,
    isPass: isPass,
  };

  // Store in array, save to localStorage, and refresh UI
  students.push(newStudent);
  saveToLocalStorage();
  renderTable();
  updateAnalytics();

  showStatus(`Record for "${nameInput}" successfully added!`, false);
  marksForm.reset();
  document.getElementById("studentName").focus();
});

// Event Delegation for Deleting a Student Record Row
recordsTableBody.addEventListener("click", function (e) {
  if (e.target.classList.contains("btn-delete-row")) {
    const indexToDelete = parseInt(e.target.getAttribute("data-index"), 10);
    const deletedStudent = students.splice(indexToDelete, 1)[0];
    saveToLocalStorage();
    renderTable();
    updateAnalytics();
    showStatus(`Removed record for "${deletedStudent.name}".`, false);
  }
});

// Clear All Stored Records
clearRecordsBtn.addEventListener("click", function () {
  if (students.length === 0) {
    showStatus("There are no records to clear.", true);
    return;
  }

  students = [];
  localStorage.removeItem(STORAGE_KEY);
  renderTable();
  updateAnalytics();
  showStatus(
    "All student records have been cleared from local storage.",
    false,
  );
});

// Reset Form clears status message
marksForm.addEventListener("reset", () => {
  clearStatus();
});

// -------------------------------------------------------------
// App Initialization
// -------------------------------------------------------------
document.addEventListener("DOMContentLoaded", () => {
  loadFromLocalStorage();
  renderTable();
  updateAnalytics();
});
