import { NextResponse } from 'next/server';
import path from 'node:path';
import { readFile } from 'node:fs/promises';

export async function GET() {
  const productsPath = path.join(process.cwd(), 'public', 'products.json');

  try {
    const fileContents = await readFile(productsPath, 'utf-8');
    const products = JSON.parse(fileContents);
    return NextResponse.json({ products });
  } catch {
    return NextResponse.json({ error: 'Failed to load product data.' }, { status: 500 });
  }
}
