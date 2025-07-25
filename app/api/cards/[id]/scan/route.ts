import { NextRequest, NextResponse } from 'next/server'
import { mockCardData } from '@/mocks/card'
import { LUD03Request } from '@/types/lnurl'

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET,OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type'
    }
  })
}

export async function GET(
  req: NextRequest,
  { params: { id: cardId } }: { params: { id: string } }
) {
  // Get query parameters
  const searchParams = req.nextUrl.searchParams
  const p = searchParams.get('p') || ''
  const c = searchParams.get('c') || ''

  // Find card by id
  const card = mockCardData.find(card => card.id === cardId)
  if (!card) {
    return NextResponse.json(
      { error: 'Card not found' },
      { status: 404, headers: { 'Access-Control-Allow-Origin': '*' } }
    )
  }

  return NextResponse.json(
    {
      tag: 'withdrawRequest',
      k1: 'k',
      minWithdrawable: 1,
      maxWithdrawable: 10000000,
      defaultDescription: 'Boltcard + NWC',
      callback: `${process.env.NEXT_PUBLIC_ENDPOINT}/api/cards/${cardId}/scan/cb?p=${p}&c=${c}`
    } as LUD03Request,
    {
      headers: {
        'Access-Control-Allow-Origin': '*'
      }
    }
  )
}
