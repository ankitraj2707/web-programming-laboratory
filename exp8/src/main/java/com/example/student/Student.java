package com.example.student;

public final class Student {
    private final String enrollmentNo;
    private final String name;
    private final String email;
    private final String course;
    private final int semester;

    public Student(String enrollmentNo, String name, String email, String course, int semester) {
        this.enrollmentNo = enrollmentNo;
        this.name = name;
        this.email = email;
        this.course = course;
        this.semester = semester;
    }

    public String getEnrollmentNo() {
        return enrollmentNo;
    }

    public String getName() {
        return name;
    }

    public String getEmail() {
        return email;
    }

    public String getCourse() {
        return course;
    }

    public int getSemester() {
        return semester;
    }
}
