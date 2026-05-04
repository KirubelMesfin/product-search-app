import { NextResponse } from 'next/server';
import path from 'node:path';
import { promisify } from 'node:util';
import { execFile } from 'node:child_process';

const execFileAsync = promisify(execFile);

export async function GET() {
  const workbookPath = path.join(process.cwd(), 'public', 'AI Search Tool Database.xlsx');
  const pyScript = `
import json
import re
import sys
import zipfile
import xml.etree.ElementTree as ET

file_path = sys.argv[1]
ns = {'a': 'http://schemas.openxmlformats.org/spreadsheetml/2006/main'}

with zipfile.ZipFile(file_path) as z:
    shared_strings = []
    if 'xl/sharedStrings.xml' in z.namelist():
        root = ET.fromstring(z.read('xl/sharedStrings.xml'))
        for si in root.findall('a:si', ns):
            parts = [t.text or '' for t in si.findall('.//a:t', ns)]
            shared_strings.append(''.join(parts))

    workbook = ET.fromstring(z.read('xl/workbook.xml'))
    sheets = workbook.findall('a:sheets/a:sheet', ns)
    if not sheets:
        print('[]')
        sys.exit(0)

    first_sheet = sheets[0]
    rel_id = first_sheet.attrib.get('{http://schemas.openxmlformats.org/officeDocument/2006/relationships}id')

    rels = ET.fromstring(z.read('xl/_rels/workbook.xml.rels'))
    rel_ns = {'r': 'http://schemas.openxmlformats.org/package/2006/relationships'}
    target = None
    for rel in rels.findall('r:Relationship', rel_ns):
        if rel.attrib.get('Id') == rel_id:
            target = rel.attrib.get('Target')
            break

    if target is None:
        print('[]')
        sys.exit(0)

    sheet_path = 'xl/' + target.replace('\\', '/').lstrip('/')
    sheet_root = ET.fromstring(z.read(sheet_path))

    rows = []
    for row in sheet_root.findall('.//a:sheetData/a:row', ns):
        cells = {}
        max_col = 0
        for cell in row.findall('a:c', ns):
            ref = cell.attrib.get('r', '')
            match = re.match(r'([A-Z]+)', ref)
            if not match:
                continue
            letters = match.group(1)
            col = 0
            for ch in letters:
                col = col * 26 + (ord(ch) - 64)
            max_col = max(max_col, col)

            val_node = cell.find('a:v', ns)
            value = '' if val_node is None or val_node.text is None else val_node.text

            if cell.attrib.get('t') == 's' and value != '':
                value = shared_strings[int(value)]

            cells[col] = value

        rows.append([cells.get(i, '') for i in range(1, max_col + 1)])

    if not rows:
        print('[]')
        sys.exit(0)

    headers = [h.strip() for h in rows[0]]
    output = []
    for row in rows[1:]:
        if not any(str(v).strip() for v in row):
            continue
        entry = {}
        for i, header in enumerate(headers):
            if header:
                entry[header] = row[i] if i < len(row) else ''
        output.append(entry)

    print(json.dumps(output))
`;

  try {
    const { stdout } = await execFileAsync('python', ['-c', pyScript, workbookPath]);
    const products = JSON.parse(stdout);
    return NextResponse.json(products);
  } catch {
    return NextResponse.json({ error: 'Failed to parse workbook.' }, { status: 500 });
  }
}
