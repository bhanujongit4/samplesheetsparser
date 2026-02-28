import { NextResponse } from 'next/server';

const SHEET_ID = '1fAqZqfhPTEWgts5dFLirfDKylp4EkJHaPPe-dm2frpY';
const GID = '1055414445'; 
const SHEET_URL = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?tqx=out:csv&gid=${GID}`;

export async function GET() {
  try {
    const response = await fetch(SHEET_URL, { cache: 'no-store' });
    const csvText = await response.text();
    const lines = csvText.split('\n');
    
    const parseLine = (line) => {
      const parts = line.split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/);
      if (parts.length < 2) return null;
      return {
        portfolio: parts[0]?.replace(/^"|"$/g, '').trim(), // Column A
        status: parts[1]?.replace(/^"|"$/g, '').trim()      // Column B
      };
    };

    const getRange = (start, end) => {
      const range = [];
      // Google Row X is index X-1
      for (let i = start - 1; i <= end - 1; i++) {
        if (lines[i]) {
          const data = parseLine(lines[i]);
          if (data && data.portfolio) range.push(data);
        }
      }
      return range;
    };

    return NextResponse.json({
      nca: getRange(7, 10),
      jcmd: getRange(14, 21),
      iscia: getRange(25, 28),
      pcsl: getRange(33, 36),
      srwe: getRange(41, 43),
      isde: getRange(48, 50),
      rocm: getRange(55, 55)
    });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch SCRF data' }, { status: 500 });
  }
}
