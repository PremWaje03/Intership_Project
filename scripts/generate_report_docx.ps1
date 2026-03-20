$ErrorActionPreference = 'Stop'

$root = 'c:\Users\PREM WAJE\OneDrive\Desktop\Intership_Project'
$reportMd = Join-Path $root 'Campus_Project_Hub_OJT_Report.md'
$outputDocx = Join-Path $root 'Campus_Project_Hub_OJT_Report_Final.docx'

$studentName = 'PREM WAJE'
$guideName = 'Prof. <Guide Name>'

$wdStory = 6
$wdPageBreak = 7
$wdAlignLeft = 0
$wdAlignCenter = 1
$wdFormatDocumentDefault = 16

if (-not (Test-Path $reportMd)) {
  throw "Report markdown file not found: $reportMd"
}

$word = $null
$doc = $null

function Add-Para {
  param(
    [Parameter(Mandatory=$true)][object]$Sel,
    [string]$Text = '',
    [string]$Font = 'Times New Roman',
    [int]$Size = 11,
    [bool]$Bold = $false,
    [int]$Align = 0
  )

  $Sel.ParagraphFormat.Alignment = $Align
  $Sel.Font.Name = $Font
  $Sel.Font.Size = $Size
  if ($Bold) { $Sel.Font.Bold = 1 } else { $Sel.Font.Bold = 0 }
  if ($Text -ne '') { $Sel.TypeText($Text) }
  $Sel.TypeParagraph()
}

try {
  $word = New-Object -ComObject Word.Application
  $word.Visible = $false
  $word.DisplayAlerts = 0

  if (Test-Path $outputDocx) {
    Remove-Item $outputDocx -Force
  }

  $doc = $word.Documents.Add()
  $doc.PageSetup.LeftMargin = $word.CentimetersToPoints(3)
  $doc.PageSetup.RightMargin = $word.CentimetersToPoints(2)
  $doc.PageSetup.TopMargin = $word.CentimetersToPoints(2)
  $doc.PageSetup.BottomMargin = $word.CentimetersToPoints(2)

  $sel = $word.Selection
  $sel.EndKey($wdStory) | Out-Null

  # Cover page
  Add-Para -Sel $sel -Text 'A' -Font 'Arial' -Size 16 -Bold $true -Align $wdAlignCenter
  Add-Para -Sel $sel -Text '' -Align $wdAlignCenter
  Add-Para -Sel $sel -Text 'REPORT' -Font 'Arial' -Size 16 -Bold $true -Align $wdAlignCenter
  Add-Para -Sel $sel -Text 'ON' -Font 'Arial' -Size 16 -Bold $true -Align $wdAlignCenter
  Add-Para -Sel $sel -Text 'OJT/Industry Internship' -Font 'Arial' -Size 16 -Bold $true -Align $wdAlignCenter
  Add-Para -Sel $sel -Text '' -Align $wdAlignCenter
  Add-Para -Sel $sel -Text 'Project Title: CAMPUS PROJECT HUB - A MERN BASED STUDENT PROJECT COLLABORATION PLATFORM' -Font 'Arial' -Size 13 -Bold $true -Align $wdAlignCenter
  Add-Para -Sel $sel -Text '' -Align $wdAlignCenter
  Add-Para -Sel $sel -Text 'Submitted by' -Font 'Times New Roman' -Size 12 -Bold $false -Align $wdAlignCenter
  Add-Para -Sel $sel -Text $studentName -Font 'Times New Roman' -Size 13 -Bold $true -Align $wdAlignCenter
  Add-Para -Sel $sel -Text '' -Align $wdAlignCenter
  Add-Para -Sel $sel -Text 'Guided by' -Font 'Times New Roman' -Size 12 -Bold $false -Align $wdAlignCenter
  Add-Para -Sel $sel -Text $guideName -Font 'Times New Roman' -Size 13 -Bold $true -Align $wdAlignCenter
  Add-Para -Sel $sel -Text '' -Align $wdAlignCenter
  Add-Para -Sel $sel -Text 'Academic Year-2024-25' -Font 'Times New Roman' -Size 12 -Bold $true -Align $wdAlignCenter
  Add-Para -Sel $sel -Text '' -Align $wdAlignCenter
  Add-Para -Sel $sel -Text 'Department of MCA' -Font 'Times New Roman' -Size 12 -Bold $true -Align $wdAlignCenter
  Add-Para -Sel $sel -Text 'K. K. Wagh Institute of Engineering Education & Research' -Font 'Times New Roman' -Size 12 -Bold $true -Align $wdAlignCenter
  Add-Para -Sel $sel -Text 'Hirabai Haridas Vidyanagari, Amrutdham, Panchavati,' -Font 'Times New Roman' -Size 12 -Bold $false -Align $wdAlignCenter
  Add-Para -Sel $sel -Text 'Nashik - 422003' -Font 'Times New Roman' -Size 12 -Bold $false -Align $wdAlignCenter
  Add-Para -Sel $sel -Text 'Autonomous Institute Since 2022' -Font 'Times New Roman' -Size 12 -Bold $false -Align $wdAlignCenter
  Add-Para -Sel $sel -Text 'Affiliated to Savitribai Phule Pune University' -Font 'Times New Roman' -Size 12 -Bold $false -Align $wdAlignCenter

  $sel.InsertBreak($wdPageBreak)

  # Certificate page
  Add-Para -Sel $sel -Text 'K. K. WAGH INSTITUTE OF ENGINEERING EDUCATION & RESEARCH' -Font 'Times New Roman' -Size 13 -Bold $true -Align $wdAlignCenter
  Add-Para -Sel $sel -Text 'NASHIK - 422003' -Font 'Times New Roman' -Size 12 -Bold $true -Align $wdAlignCenter
  Add-Para -Sel $sel -Text 'AUTONOMOUS INSTITUTE SINCE 2022' -Font 'Times New Roman' -Size 12 -Bold $true -Align $wdAlignCenter
  Add-Para -Sel $sel -Text '' -Align $wdAlignCenter
  Add-Para -Sel $sel -Text 'CERTIFICATE' -Font 'Arial' -Size 16 -Bold $true -Align $wdAlignCenter
  Add-Para -Sel $sel -Text '' -Align $wdAlignCenter
  Add-Para -Sel $sel -Text 'This is to certify that' -Font 'Times New Roman' -Size 12 -Bold $false -Align $wdAlignCenter
  Add-Para -Sel $sel -Text $studentName -Font 'Times New Roman' -Size 14 -Bold $true -Align $wdAlignCenter
  Add-Para -Sel $sel -Text 'has successfully completed the On Job Training/Industry Internship' -Font 'Times New Roman' -Size 12 -Bold $false -Align $wdAlignCenter
  Add-Para -Sel $sel -Text 'during academic year 2024-2025' -Font 'Times New Roman' -Size 12 -Bold $false -Align $wdAlignCenter
  Add-Para -Sel $sel -Text '' -Align $wdAlignCenter
  Add-Para -Sel $sel -Text ($guideName + '      Dr. V. C. Bagal      Dr. K. N. Nandurkar') -Font 'Times New Roman' -Size 11 -Bold $true -Align $wdAlignCenter
  Add-Para -Sel $sel -Text 'Guide              I/c Head, Dept. of MCA              Director, KKWIEER' -Font 'Times New Roman' -Size 11 -Bold $false -Align $wdAlignCenter

  $sel.InsertBreak($wdPageBreak)

  # Internship completion certificate placeholder
  Add-Para -Sel $sel -Text 'INTERNSHIP COMPLETION CERTIFICATE' -Font 'Arial' -Size 16 -Bold $true -Align $wdAlignCenter
  Add-Para -Sel $sel -Text '' -Align $wdAlignCenter
  Add-Para -Sel $sel -Text '(Attach organization-issued internship completion certificate on this page.)' -Font 'Times New Roman' -Size 12 -Bold $false -Align $wdAlignCenter

  $sel.InsertBreak($wdPageBreak)

  # Main report body from markdown (starting ABSTRACT)
  $lines = Get-Content $reportMd
  $startIndex = [Array]::IndexOf($lines, '# ABSTRACT')
  if ($startIndex -lt 0) {
    throw 'Could not find # ABSTRACT in report markdown.'
  }

  for ($i = $startIndex; $i -lt $lines.Length; $i++) {
    $line = $lines[$i]
    $trimmed = $line.Trim()

    if ($trimmed -eq '---') {
      $sel.InsertBreak($wdPageBreak)
      continue
    }

    if ($trimmed -match '^#\s+(.+)$') {
      Add-Para -Sel $sel -Text $Matches[1] -Font 'Arial' -Size 16 -Bold $true -Align $wdAlignLeft
      continue
    }

    if ($trimmed -match '^##\s+(.+)$') {
      Add-Para -Sel $sel -Text $Matches[1] -Font 'Arial' -Size 14 -Bold $true -Align $wdAlignLeft
      continue
    }

    if ($trimmed -match '^###\s+(.+)$') {
      Add-Para -Sel $sel -Text $Matches[1] -Font 'Arial' -Size 12 -Bold $true -Align $wdAlignLeft
      continue
    }

    if ($trimmed -match '^-\s+(.+)$') {
      $sel.ParagraphFormat.Alignment = $wdAlignLeft
      $sel.Font.Name = 'Times New Roman'
      $sel.Font.Size = 11
      $sel.Font.Bold = 0
      $sel.Range.ListFormat.ApplyBulletDefault()
      $sel.TypeText($Matches[1])
      $sel.TypeParagraph()
      $sel.Range.ListFormat.RemoveNumbers()
      continue
    }

    if ($trimmed -eq '') {
      Add-Para -Sel $sel -Text '' -Font 'Times New Roman' -Size 11 -Bold $false -Align $wdAlignLeft
      continue
    }

    Add-Para -Sel $sel -Text $trimmed -Font 'Times New Roman' -Size 11 -Bold $false -Align $wdAlignLeft
  }

  $doc.SaveAs2($outputDocx, $wdFormatDocumentDefault)
  $doc.Close()
  $word.Quit()

  Write-Output "Created: $outputDocx"
}
catch {
  if ($doc -ne $null) { $doc.Close($false) }
  if ($word -ne $null) { $word.Quit() }
  throw
}
finally {
  if ($word -ne $null) {
    [System.Runtime.InteropServices.Marshal]::ReleaseComObject($word) | Out-Null
  }
  [GC]::Collect()
  [GC]::WaitForPendingFinalizers()
}
