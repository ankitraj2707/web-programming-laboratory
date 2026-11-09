package com.example.student;

import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.Set;
import java.util.regex.Pattern;

@WebServlet(name = "RegistrationServlet", urlPatterns = "/register")
public final class RegistrationServlet extends HttpServlet {
    private static final Pattern ENROLLMENT_PATTERN = Pattern.compile("[A-Za-z0-9/-]{3,20}");
    private static final Pattern EMAIL_PATTERN =
            Pattern.compile("[A-Za-z0-9.!#$%&'*+/=?^_`{|}~-]+@[A-Za-z0-9](?:[A-Za-z0-9-]{0,61}[A-Za-z0-9])?(?:\\.[A-Za-z0-9](?:[A-Za-z0-9-]{0,61}[A-Za-z0-9])?)+");
    private static final Set<String> COURSES = Set.of(
            "B.Tech Computer Science",
            "B.Tech Information Technology",
            "B.Tech Artificial Intelligence",
            "BCA",
            "MCA");

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        request.setCharacterEncoding("UTF-8");

        String enrollmentNo = trim(request.getParameter("enrollmentNo"));
        String name = trim(request.getParameter("name"));
        String email = trim(request.getParameter("email"));
        String course = trim(request.getParameter("course"));
        String semesterValue = trim(request.getParameter("semester"));
        List<String> errors = new ArrayList<>();

        if (enrollmentNo == null || !ENROLLMENT_PATTERN.matcher(enrollmentNo).matches()) {
            errors.add("Enrollment number must be 3-20 letters, digits, hyphens, or slashes.");
        }
        if (name == null || name.length() > 80 || !name.matches("[\\p{L}][\\p{L} .'-]*")) {
            errors.add("Enter a name of up to 80 characters using letters, spaces, apostrophes, periods, or hyphens.");
        }
        if (email == null || email.length() > 254 || !EMAIL_PATTERN.matcher(email).matches()) {
            errors.add("Enter a valid email address (maximum 254 characters).");
        }
        if (course == null || !COURSES.contains(course)) {
            errors.add("Select a course from the list.");
        }

        int semester = 0;
        try {
            semester = Integer.parseInt(semesterValue);
            if (semester < 1 || semester > 8) {
                errors.add("Semester must be between 1 and 8.");
            }
        } catch (NumberFormatException exception) {
            errors.add("Select a valid semester.");
        }

        if (!errors.isEmpty()) {
            request.setAttribute("errors", errors);
            request.getRequestDispatcher("/index.jsp").forward(request, response);
            return;
        }

        Student student = new Student(enrollmentNo, name, email, course, semester);
        HttpSession session = request.getSession(true);
        session.setAttribute("student", student);
        request.setAttribute("student", student);
        request.getRequestDispatcher("/confirmation.jsp").forward(request, response);
    }

    private static String trim(String value) {
        return value == null ? null : value.trim();
    }
}
