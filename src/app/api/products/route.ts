import { NextRequest, NextResponse } from 'next/server';
import { getProducts, ProductCategory } from '@/lib/products';

export async function GET(req: NextRequest) {
  const category = req.nextUrl.searchParams.get('category') as ProductCategory | null;
  return NextResponse.json(getProducts(category ?? undefined));
}
