<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
  <xsl:output method="html" indent="yes" encoding="UTF-8"/>

  <xsl:template match="/students">
    <html>
      <head>
        <meta charset="UTF-8"/>
        <meta name="viewport" content="width=device-width, initial-scale=1"/>
        <title>Student academic records</title>
        <style>
          body { max-width: 1100px; margin: 24px auto; padding: 0 18px; background: #f4f6f9; color: #263445; font: 16px/1.5 Arial, sans-serif; }
          h1 { color: #1b5277; }
          table { width: 100%; border-collapse: collapse; background: #fff; }
          th, td { border: 1px solid #d7dee8; padding: 10px; text-align: left; vertical-align: top; }
          th { background: #34495e; color: #fff; }
          .student-row:nth-child(even) { background: #f8fafc; }
          .sub-table { min-width: 380px; }
          .sub-table td { padding: 5px 8px; }
          .pass { color: #176b37; font-weight: bold; }
          .fail { color: #a4262c; font-weight: bold; }
          @media (max-width: 700px) { .report { display: block; overflow-x: auto; } }
        </style>
      </head>
      <body>
        <h1>Student Academic Performance Report</h1>
        <table class="report">
          <thead>
            <tr>
              <th>Enrollment No.</th>
              <th>Student Name</th>
              <th>Course</th>
              <th>Semester</th>
              <th>Subject Breakdown (Marks &amp; Status)</th>
            </tr>
          </thead>
          <tbody>
            <xsl:for-each select="student">
              <xsl:sort select="name" data-type="text" order="ascending"/>
              <tr class="student-row">
                <td><strong><xsl:value-of select="@enrollmentNo"/></strong></td>
                <td><xsl:value-of select="name"/></td>
                <td><xsl:value-of select="course"/></td>
                <td><xsl:value-of select="semester"/></td>
                <td>
                  <table class="sub-table">
                    <thead>
                      <tr><th>Subject</th><th>Marks</th><th>Result</th></tr>
                    </thead>
                    <xsl:for-each select="marks/subject">
                      <tr>
                        <td><xsl:value-of select="@code"/>: <xsl:value-of select="@name"/></td>
                        <td><xsl:value-of select="."/> / 100</td>
                        <td>
                          <xsl:choose>
                            <xsl:when test=". &gt;= 40">
                              <span class="pass">PASS</span>
                            </xsl:when>
                            <xsl:otherwise>
                              <span class="fail">FAIL</span>
                            </xsl:otherwise>
                          </xsl:choose>
                        </td>
                      </tr>
                    </xsl:for-each>
                  </table>
                </td>
              </tr>
            </xsl:for-each>
          </tbody>
        </table>
        <p>PASS: 40 marks or more. FAIL: fewer than 40 marks.</p>
      </body>
    </html>
  </xsl:template>
</xsl:stylesheet>