<%@ page contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" %>
<%
  response.setHeader("Cache-Control", "no-store");
  if (session.getAttribute("student") != null) {
    response.sendRedirect(request.getContextPath() + "/welcome");
    return;
  }
%>
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Student Registration</title>
  <link rel="stylesheet" href="<%= request.getContextPath() %>/styles.css">
</head>
<body>
  <main class="card">
    <p class="eyebrow">STUDENT PORTAL</p>
    <h1>Create your registration</h1>
    <p class="intro">Enter your details below. All fields are required.</p>

    <% if (request.getAttribute("errors") != null) {
         java.util.List<String> errors = (java.util.List<String>) request.getAttribute("errors");
    %>
      <div class="alert" role="alert">
        <strong>Please correct the following:</strong>
        <ul>
          <% for (String error : errors) { %>
            <li><%= com.example.student.Html.escape(error) %></li>
          <% } %>
        </ul>
      </div>
    <% } %>

    <form action="<%= request.getContextPath() %>/register" method="post">
      <label for="enrollmentNo">Enrollment number</label>
      <input id="enrollmentNo" name="enrollmentNo" type="text"
             value="<%= com.example.student.Html.escape(request.getParameter("enrollmentNo")) %>"
             pattern="[A-Za-z0-9/-]{3,20}" maxlength="20" required
             autocomplete="off" placeholder="e.g. ENR2026001">

      <label for="name">Full name</label>
      <input id="name" name="name" type="text"
             value="<%= com.example.student.Html.escape(request.getParameter("name")) %>"
             maxlength="80" required autocomplete="name" placeholder="Your full name">

      <label for="email">Email address</label>
      <input id="email" name="email" type="email"
             value="<%= com.example.student.Html.escape(request.getParameter("email")) %>"
             maxlength="254" required autocomplete="email" placeholder="you@example.com">

      <label for="course">Course</label>
      <select id="course" name="course" required>
        <option value="">Select a course</option>
        <%
          String[] courses = {"B.Tech Computer Science", "B.Tech Information Technology",
                              "B.Tech Artificial Intelligence", "BCA", "MCA"};
          String selectedCourse = request.getParameter("course");
          for (String course : courses) {
        %>
          <option value="<%= com.example.student.Html.escape(course) %>"
            <%= course.equals(selectedCourse) ? "selected" : "" %>><%= com.example.student.Html.escape(course) %></option>
        <% } %>
      </select>

      <label for="semester">Semester</label>
      <select id="semester" name="semester" required>
        <option value="">Select a semester</option>
        <% for (int semester = 1; semester <= 8; semester++) { %>
          <option value="<%= semester %>"
            <%= String.valueOf(semester).equals(request.getParameter("semester")) ? "selected" : "" %>>
            Semester <%= semester %>
          </option>
        <% } %>
      </select>

      <button type="submit">Register</button>
    </form>
  </main>
</body>
</html>
