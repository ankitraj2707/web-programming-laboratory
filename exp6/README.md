# Student records: XML, DTD, XSD, CSS, and XSLT

`students.xml` contains five student records, each with an enrollment number,
name, course, semester, and marks for exactly five subjects. Its document type
declaration links to `students.dtd`; its `xsi:noNamespaceSchemaLocation`
attribute identifies `students.xsd` for schema-aware validators.

## Validation

Run these commands from this directory with `xmllint` installed:

```text
xmllint --noout --valid students.xml
xmllint --noout --schema students.xsd students.xml
```

Both commands should succeed. `invalid-student.xml` keeps four valid records
and adds a deliberately invalid fifth: its enrollment number does not match
the required pattern, its semester is 9, two marks are outside 0-100, and it
has only three subjects. The schema check should fail:

```text
xmllint --noout --schema students.xsd invalid-student.xml
```

The DTD checks document structure, at least five students, exactly five
subjects per student, and unique XML `ID` enrollment values. DTDs cannot
constrain numeric ranges or express the enrollment-number pattern; those
datatype constraints are provided by the XSD.

## Viewing and comparing the stylesheets

Open `students.xml` in a browser that supports XML stylesheets. It currently
uses `students.xsl` to transform the records into a sortable HTML report.
To view the XML tree styled by `students.css`, switch the active stylesheet
processing instruction at the top of `students.xml` from XSLT to CSS.

CSS styles the XML elements and displays their values in the source order; it
does not sort students or calculate pass/fail status from marks. XSLT produces
an HTML table, sorts students alphabetically with `xsl:sort`, iterates over
students and subjects with `xsl:for-each`, and uses `xsl:choose` to mark each
subject PASS (40 or more) or FAIL (below 40).
