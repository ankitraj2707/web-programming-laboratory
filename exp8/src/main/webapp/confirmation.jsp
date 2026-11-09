<%@ page contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" %>
<%@ page import="com.example.student.Student" %>
<%
  response.setHeader("Cache-Control", "no-store");
  Student student = (Student) request.getAttribute("student");
  if (student == null) {
    response.sendRedirect(request.getContextPath() + "/welcome");
    return;
  }
%>
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Registration confirmed</title>
  <link rel="stylesheet" href="<%= request.getContextPath() %>/styles.css">
</head>
<body>
  <main class="card">
    <p class="eyebrow">REGISTRATION COMPLETE</p>
    <h1>Welcome, <%= com.example.student.Html.escape(student.getName()) %>!</h1>
    <p class="intro">Your registration details have been saved to this session.</p>

    <dl class="details">
      <dt>Enrollment number</dt>
      <dd><%= com.example.student.Html.escape(student.getEnrollmentNo()) %></dd>
      <dt>Name</dt>
      <dd><%= com.example.student.Html.escape(student.getName()) %></dd>
      <dt>Email</dt>
      <dd><%= com.example.student.Html.escape(student.getEmail()) %></dd>
      <dt>Course</dt>
      <dd><%= com.example.student.Html.escape(student.getCourse()) %></dd>
      <dt>Semester</dt>
      <dd><%= student.getSemester() %></dd>
    </dl>

    <form action="<%= request.getContextPath() %>/logout" method="post">
      <button class="secondary" type="submit">Log out</button>
    </form>
  </main>
</body>
</html>
