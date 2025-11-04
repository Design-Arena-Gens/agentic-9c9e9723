import { NextRequest, NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const framesParam = searchParams.get('frames')

    if (!framesParam) {
      return NextResponse.json(
        { error: 'No frames provided' },
        { status: 400 }
      )
    }

    const frames = JSON.parse(decodeURIComponent(framesParam))

    // In a real implementation, this would create a GIF or video file
    // For this demo, we'll return JSON with frame data
    const downloadData = {
      type: 'animation',
      frameCount: frames.length,
      frames: frames,
      format: 'json',
      timestamp: new Date().toISOString(),
    }

    return new NextResponse(JSON.stringify(downloadData, null, 2), {
      headers: {
        'Content-Type': 'application/json',
        'Content-Disposition': `attachment; filename="manga-animation-${Date.now()}.json"`,
      },
    })
  } catch (error) {
    console.error('Error creating download:', error)
    return NextResponse.json(
      { error: 'Failed to create download' },
      { status: 500 }
    )
  }
}
