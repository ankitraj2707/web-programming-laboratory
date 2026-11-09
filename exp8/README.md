# Student Registration (Tomcat 10)

A Jakarta Servlet/JSP student-registration application for Apache Tomcat 10.1
and Java 25 (the current LTS release). It demonstrates POST handling, server-side validation,
`RequestDispatcher` forwarding, `HttpSession`, logout, annotation-based
registration, and `web.xml` servlet mappings.

## Run on Tomcat

1. Install JDK 25 and Apache Tomcat 10.1.
2. From this directory, build the WAR:

   ```text
   mvn clean package
   ```

3. Copy `target/student-registration.war` to Tomcat's `webapps` directory and
   start Tomcat.
4. Open `http://localhost:8080/student-registration/`.

The project uses the Servlet 6.0 API provided by Tomcat 10.1; the servlet
dependency is `provided` and is not bundled in the WAR.

`RegistrationServlet` uses `@WebServlet` to map `/register`. `WelcomeServlet`
and `LogoutServlet` are declared in `WEB-INF/web.xml`. The descriptor keeps
annotation processing enabled. Logout uses POST and invalidates the session.

Registration errors are forwarded back to the form with validation messages.
Successful registration stores a `Student` in the session and forwards to
`confirmation.jsp`. Refreshing `/welcome` reads the saved student from the
existing session; accessing it without a session redirects to registration.
