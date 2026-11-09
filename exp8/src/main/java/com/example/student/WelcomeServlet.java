package com.example.student;

import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;

import java.io.IOException;

public final class WelcomeServlet extends HttpServlet {
    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        response.setHeader("Cache-Control", "no-store");
        HttpSession session = request.getSession(false);
        Student student = session == null ? null : (Student) session.getAttribute("student");
        if (student == null) {
            response.sendRedirect(request.getContextPath() + "/");
            return;
        }

        request.setAttribute("student", student);
        request.getRequestDispatcher("/confirmation.jsp").forward(request, response);
    }
}
