import { NextResponse } from 'next/server';

const SHEET_ID = '1fAqZqfhPTEWgts5dFLirfDKylp4EkJHaPPe-dm2frpY';
const GID = '1644985801'; 
const SHEET_URL = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?tqx=out:csv&gid=${GID}`;

export async function GET() {
  try {
    const response = await fetch(SHEET_URL, { cache: 'no-store' });
    const csvText = await response.text();
    const lines = csvText.split('\n');
    
    const members = [];
    const observers = [];

    const parseLine = (line) => {
      const parts = line.split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/);
      if (parts.length < 3) return null;
      return {
        country: parts[1].replace(/^"|"$/g, '').trim(), // Column B
        status: parts[2].replace(/^"|"$/g, '').trim().toUpperCase() // Column C
      };
    };

    // Members: Rows 7 to 53 (Indices 6 to 52)
    for (let i = 6; i <= 52; i++) {
      if (lines[i]) {
        const data = parseLine(lines[i]);
        if (data && data.country) members.push(data);
      }
    }

    // Observers: Rows 57 to 76 (Indices 56 to 75)
    for (let i = 56; i <= 75; i++) {
      if (lines[i]) {
        const data = parseLine(lines[i]);
        if (data && data.country) observers.push(data);
      }
    }

    return NextResponse.json({ members, observers });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch OIC data' }, { status: 500 });
  }
}
