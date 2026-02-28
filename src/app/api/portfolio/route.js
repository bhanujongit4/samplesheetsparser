import { NextResponse } from 'next/server';

const SHEET_ID = '1fAqZqfhPTEWgts5dFLirfDKylp4EkJHaPPe-dm2frpY';
const GID = '1771719611';
// Using gviz/tq for precise sheet selection and CSV output
const SHEET_URL = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?tqx=out:csv&gid=${GID}`;

export async function GET() {
  try {
    const response = await fetch(SHEET_URL, {
      cache: 'no-store', // Ensures we always get the latest data
    });

    if (!response.ok) throw new Error('Failed to fetch from Google Sheets');

    const csvText = await response.text();
    const lines = csvText.split('\n');
    
    const permanentMembers = [];
    const nonPermanentMembers = [];

    // Helper to clean and parse rows
    const parseLine = (line) => {
      const parts = line.split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/); // Split by comma not inside quotes
      if (parts.length < 3) return null;
      
      const country = parts[1].replace(/^"|"$/g, '').trim(); // Column B
      const status = parts[2].replace(/^"|"$/g, '').trim();  // Column C
      return { country, status };
    };

    // Google Sheets index is 1-based, but CSV lines array is 0-based
    // Row 6 in Sheets is index 5 in the array
    
    // 1. Extract Permanent Members (Rows 6 to 10)
    for (let i = 4; i <= 9; i++) {
      if (lines[i]) {
        const data = parseLine(lines[i]);
        if (data) permanentMembers.push({ ...data, type: 'PERMANENT' });
      }
    }

    // 2. Extract Non-Permanent Members (Rows 14 to 33)
    for (let i = 12; i <= 32; i++) {
      if (lines[i]) {
        const data = parseLine(lines[i]);
        if (data) nonPermanentMembers.push({ ...data, type: 'NON-PERMANENT' });
      }
    }

    return NextResponse.json({
      total: permanentMembers.length + nonPermanentMembers.length,
      permanent: permanentMembers,
      non_permanent: nonPermanentMembers
    });

  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json({ error: 'Internal Server Error', details: error.message }, { status: 500 });
  }
}
