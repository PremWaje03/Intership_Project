import fs from "node:fs";
import path from "node:path";
import {
  AlignmentType,
  Document,
  Footer,
  Packer,
  PageNumber,
  Paragraph,
  TextRun
} from "docx";

const root = "c:/Users/PREM WAJE/OneDrive/Desktop/Intership_Project";
const reportMdPath = path.join(root, "Campus_Project_Hub_OJT_Report.md");
const outputPath = path.join(root, "Campus_Project_Hub_OJT_Report_Final.docx");

const studentName = "PREM WAJE";
const guideName = "Prof. <Guide Name>";

if (!fs.existsSync(reportMdPath)) {
  throw new Error(`Missing report markdown: ${reportMdPath}`);
}

const content = fs.readFileSync(reportMdPath, "utf8");
const lines = content.split(/\r?\n/);
const startIndex = lines.findIndex((line) => line.trim() === "# ABSTRACT");
if (startIndex < 0) {
  throw new Error("Could not find '# ABSTRACT' in report markdown.");
}

const para = (text = "", opts = {}) => {
  const {
    font = "Times New Roman",
    size = 22,
    bold = false,
    alignment = AlignmentType.LEFT,
    bullet = false,
    pageBreakBefore = false
  } = opts;

  const paragraphOptions = {
    alignment,
    pageBreakBefore,
    children: text
      ? [
          new TextRun({
            text,
            font,
            size,
            bold
          })
        ]
      : []
  };

  if (bullet) {
    paragraphOptions.bullet = { level: 0 };
  }

  return new Paragraph(paragraphOptions);
};

const bodyChildren = [];

const add = (p) => bodyChildren.push(p);
const addBlank = () => add(new Paragraph({}));

// Cover Page
add(para("A", { font: "Arial", size: 32, bold: true, alignment: AlignmentType.CENTER }));
addBlank();
add(para("REPORT", { font: "Arial", size: 32, bold: true, alignment: AlignmentType.CENTER }));
add(para("ON", { font: "Arial", size: 32, bold: true, alignment: AlignmentType.CENTER }));
add(para("OJT/Industry Internship", { font: "Arial", size: 32, bold: true, alignment: AlignmentType.CENTER }));
addBlank();
add(
  para("Project Title: CAMPUS PROJECT HUB - A MERN BASED STUDENT PROJECT COLLABORATION PLATFORM", {
    font: "Arial",
    size: 26,
    bold: true,
    alignment: AlignmentType.CENTER
  })
);
addBlank();
add(para("Submitted by", { size: 24, alignment: AlignmentType.CENTER }));
add(para(studentName, { size: 26, bold: true, alignment: AlignmentType.CENTER }));
addBlank();
add(para("Guided by", { size: 24, alignment: AlignmentType.CENTER }));
add(para(guideName, { size: 26, bold: true, alignment: AlignmentType.CENTER }));
addBlank();
add(para("Academic Year-2024-25", { size: 24, bold: true, alignment: AlignmentType.CENTER }));
addBlank();
add(para("Department of MCA", { size: 24, bold: true, alignment: AlignmentType.CENTER }));
add(
  para("K. K. Wagh Institute of Engineering Education & Research", {
    size: 24,
    bold: true,
    alignment: AlignmentType.CENTER
  })
);
add(para("Hirabai Haridas Vidyanagari, Amrutdham, Panchavati,", { size: 24, alignment: AlignmentType.CENTER }));
add(para("Nashik - 422003", { size: 24, alignment: AlignmentType.CENTER }));
add(para("Autonomous Institute Since 2022", { size: 24, alignment: AlignmentType.CENTER }));
add(para("Affiliated to Savitribai Phule Pune University", { size: 24, alignment: AlignmentType.CENTER }));

// Certificate Page
add(para("", { pageBreakBefore: true }));
add(
  para("K. K. WAGH INSTITUTE OF ENGINEERING EDUCATION & RESEARCH", {
    size: 24,
    bold: true,
    alignment: AlignmentType.CENTER
  })
);
add(para("NASHIK - 422003", { size: 24, bold: true, alignment: AlignmentType.CENTER }));
add(para("AUTONOMOUS INSTITUTE SINCE 2022", { size: 24, bold: true, alignment: AlignmentType.CENTER }));
addBlank();
add(para("CERTIFICATE", { font: "Arial", size: 32, bold: true, alignment: AlignmentType.CENTER }));
addBlank();
add(para("This is to certify that", { size: 24, alignment: AlignmentType.CENTER }));
add(para(studentName, { size: 28, bold: true, alignment: AlignmentType.CENTER }));
add(
  para("has successfully completed the On Job Training/Industry Internship", {
    size: 24,
    alignment: AlignmentType.CENTER
  })
);
add(para("during academic year 2024-2025", { size: 24, alignment: AlignmentType.CENTER }));
addBlank();
add(
  para(`${guideName}      Dr. V. C. Bagal      Dr. K. N. Nandurkar`, {
    size: 22,
    bold: true,
    alignment: AlignmentType.CENTER
  })
);
add(
  para("Guide              I/c Head, Dept. of MCA              Director, KKWIEER", {
    size: 22,
    alignment: AlignmentType.CENTER
  })
);

// Internship completion certificate placeholder
add(para("", { pageBreakBefore: true }));
add(
  para("INTERNSHIP COMPLETION CERTIFICATE", {
    font: "Arial",
    size: 32,
    bold: true,
    alignment: AlignmentType.CENTER
  })
);
addBlank();
add(
  para("(Attach organization-issued internship completion certificate on this page.)", {
    size: 24,
    alignment: AlignmentType.CENTER
  })
);

// Body from markdown starting ABSTRACT
add(para("", { pageBreakBefore: true }));

for (let i = startIndex; i < lines.length; i += 1) {
  const raw = lines[i];
  const line = raw.trim();

  if (line === "---") {
    add(para("", { pageBreakBefore: true }));
    continue;
  }

  if (/^#\s+/.test(line)) {
    add(
      para(line.replace(/^#\s+/, ""), {
        font: "Arial",
        size: 32,
        bold: true,
        alignment: AlignmentType.LEFT
      })
    );
    continue;
  }

  if (/^##\s+/.test(line)) {
    add(
      para(line.replace(/^##\s+/, ""), {
        font: "Arial",
        size: 28,
        bold: true,
        alignment: AlignmentType.LEFT
      })
    );
    continue;
  }

  if (/^###\s+/.test(line)) {
    add(
      para(line.replace(/^###\s+/, ""), {
        font: "Arial",
        size: 24,
        bold: true,
        alignment: AlignmentType.LEFT
      })
    );
    continue;
  }

  if (/^-\s+/.test(line)) {
    add(
      para(line.replace(/^-\s+/, ""), {
        size: 22,
        bullet: true,
        alignment: AlignmentType.LEFT
      })
    );
    continue;
  }

  if (!line) {
    addBlank();
    continue;
  }

  add(para(line, { size: 22, alignment: AlignmentType.LEFT }));
}

const footer = new Footer({
  children: [
    new Paragraph({
      alignment: AlignmentType.RIGHT,
      children: [
        new TextRun({ text: "Page ", font: "Times New Roman", size: 20 }),
        new TextRun({ children: [PageNumber.CURRENT], font: "Times New Roman", size: 20 }),
        new TextRun({ text: " of ", font: "Times New Roman", size: 20 }),
        new TextRun({ children: [PageNumber.TOTAL_PAGES], font: "Times New Roman", size: 20 })
      ]
    })
  ]
});

const doc = new Document({
  sections: [
    {
      properties: {
        page: {
          margin: {
            top: 1134,
            right: 1134,
            bottom: 1134,
            left: 1701
          }
        }
      },
      footers: {
        default: footer
      },
      children: bodyChildren
    }
  ]
});

const buffer = await Packer.toBuffer(doc);
fs.writeFileSync(outputPath, buffer);
console.log(`Created: ${outputPath}`);
