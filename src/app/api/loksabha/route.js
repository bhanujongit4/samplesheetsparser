import { NextResponse } from 'next/server';

const SHEET_ID = '1fAqZqfhPTEWgts5dFLirfDKylp4EkJHaPPe-dm2frpY';
const GID = '0'; 
const SHEET_URL = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?tqx=out:csv&gid=${GID}`;

export async function GET() {
  try {
    const response = await fetch(SHEET_URL, { cache: 'no-store' });
    const csvText = await response.text();
    const lines = csvText.split('\n');
    
    const portfolios = [];

    const parseLine = (line) => {
      // Split by comma while respecting quotes
      const parts = line.split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/);
      if (parts.length < 4) return null;
      
      return {
        portfolio: parts[1]?.replace(/^"|"$/g, '').trim(), // Column B
        party: parts[2]?.replace(/^"|"$/g, '').trim(),     // Column C
        status: parts[3]?.replace(/^"|"$/g, '').trim()      // Column D
      };
    };

    // Data: Rows 6 to 92 (Indices 5 to 91)
    for (let i = 5; i <= 91; i++) {
      if (lines[i]) {
        const data = parseLine(lines[i]);
        // Only add if there is a portfolio name
        if (data && data.portfolio) {
          portfolios.push(data);
        }
      }
    }

    return NextResponse.json(portfolios);
  } catch (error) {
    console.error('Lok Sabha API Error:', error);
    return NextResponse.json({ error: 'Failed to fetch Lok Sabha data' }, { status: 500 });
  }
}
