import { NextResponse } from 'next/server';

const SHEET_ID = '1xH9W0hDkHZBBsdp7q-DPSZEvM90NMm-Y75RF-OK4hLA';
const SHEET_URL = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?tqx=out:csv`;

export async function GET() {
  try {
    const response = await fetch(SHEET_URL, {
      cache: 'no-store', // Always fetch fresh data
    });
    
    const csvText = await response.text();
    console.log('Raw CSV:', csvText.substring(0, 500)); // Log first 500 chars
    
    // Parse CSV manually
    const lines = csvText.split('\n');
    console.log('Total lines:', lines.length);
    console.log('First 5 lines:', lines.slice(0, 5));
    const countries = [];
    
    // Skip rows 0, 1 (ECOSOC header and labels at row 2)
    // Data starts at row 3 (index 2 in array)
    for (let i = 2; i < lines.length; i++) {
      const line = lines[i].trim();
      if (!line) continue;
      
      // Handle different CSV formats
      let country, status;
      
      // Try quoted format: "Country","Status"
      const quotedMatch = line.match(/^"([^"]+)","([^"]+)"$/);
      if (quotedMatch) {
        country = quotedMatch[1];
        status = quotedMatch[2];
      } else {
        // Try comma-separated format: Country,Status
        const parts = line.split(',');
        if (parts.length >= 2) {
          country = parts[0].replace(/^"|"$/g, '').trim();
          status = parts[1].replace(/^"|"$/g, '').trim();
        }
      }
      
      if (country && status) {
        countries.push({
          country: country,
          status: status.toUpperCase(),
        });
      }
    }
    
    console.log('Parsed countries count:', countries.length);
    console.log('Sample countries:', countries.slice(0, 3));
    
    return NextResponse.json(countries);
  } catch (error) {
    console.error('Error fetching sheet:', error);
    return NextResponse.json({ error: 'Failed to fetch data' }, { status: 500 });
  }
}