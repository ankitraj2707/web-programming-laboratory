<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
  <xsl:output method="html" encoding="UTF-8" indent="yes"/>

  <xsl:template match="/">
    <html lang="en">
    <head>
      <meta charset="UTF-8"/>
      <title>Student Records - XSLT View</title>
      <style>
        body {
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
          background-color: #f8fafc;
          padding: 2rem;
          color: #1e293b;
        }
        .container {
          max-width: 1000px;
          margin: 0 auto;
          background: #ffffff;
          padding: 2rem;
          border-radius: 10px;
          box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1);
        }
        h2 {
          text-align: center;
          color: #0f172a;
          margin-bottom: 1.5rem;
        }
        table {
          width: 100%;
          border-collapse: collapse;
          text-align: center;
          font-size: 0.9rem;
        }
        th, td {
          border: 1px solid #cbd5e1;
          padding: 0.65rem 0.5rem;
        }
        th {
          background-color: #0f172a;
          color: #f8fafc;
        }
        tr:nth-child(even) {
          background-color: #f8fafc;
        }
        /* Pass / Fail Badges */
        .status-pass {
          background-color: #dcfce7;
          color: #15803d;
          font-weight: 700;
          padding: 0.25rem 0.6rem;
          border-radius: 4px;
        }
        .status-fail {
          background-color: #fee2e2;
          color: #b91c1c;
          font-weight: 700;
          padding: 0.25rem 0.6rem;
          border-radius: 4px;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <h2>Student Evaluation Report (Sorted Alphabetically by Name)</h2>
        <table>
          <thead>
            <tr>
              <th>Enrollment No.</th>
              <th>Name</th>
              <th>Course</th>
              <th>Sem</th>
              <th>S1</th>
              <th>S2</th>
              <th>S3</th>
              <th>S4</th>
              <th>S5</th>
              <th>Total (500)</th>
              <th>Result</th>
            </tr>
          </thead>
          <tbody>
            <!-- Iterate and sort students by name -->
            <xsl:for-each select="students/student">
              <xsl:sort select="name" order="ascending" data-type="text"/>

              <!-- Precompute total marks -->
              <xsl:variable name="total" select="marks/subject1 + marks/subject2 + marks/subject3 + marks/subject4 + marks/subject5"/>

              <tr>
                <td><strong><xsl:value-of select="@enrollmentNo"/></strong></td>
                <td style="text-align: left; padding-left: 0.8rem;"><xsl:value-of select="name"/></td>
                <td><xsl:value-of select="course"/></td>
                <td><xsl:value-of select="semester"/></td>
                <td><xsl:value-of select="marks/subject1"/></td>
                <td><xsl:value-of select="marks/subject2"/></td>
                <td><xsl:value-of select="marks/subject3"/></td>
                <td><xsl:value-of select="marks/subject4"/></td>
                <td><xsl:value-of select="marks/subject5"/></td>
                <td><strong><xsl:value-of select="$total"/></strong></td>
                
                <!-- Determine Pass/Fail (Fail if any subject < 40) -->
                <td>
                  <xsl:choose>
                    <xsl:when test="marks/subject1 &lt; 40 or 
                                    marks/subject2 &lt; 40 or 
                                    marks/subject3 &lt; 40 or 
                                    marks/subject4 &lt; 40 or 
                                    marks/subject5 &lt; 40">
                      <span class="status-fail">FAIL</span>
                    </xsl:when>
                    <xsl:otherwise>
                      <span class="status-pass">PASS</span>
                    </xsl:otherwise>
                  </xsl:choose>
                </td>
              </tr>
            </xsl:for-each>
          </tbody>
        </table>
      </div>
    </body>
    </html>
  </xsl:template>
</xsl:stylesheet>