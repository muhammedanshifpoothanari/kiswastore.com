import { NextRequest, NextResponse } from 'next/server'
import crypto from 'crypto'
import fs from 'fs'
import path from 'path'

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File | null
    if (!file) {
      return NextResponse.json({ success: false, error: 'No file provided' }, { status: 400 })
    }

    const buffer = Buffer.from(await file.arrayBuffer())

    // Check Cloudinary environment variables
    const cloudName = process.env.CLOUDINARY_CLOUD_NAME
    const apiKey = process.env.CLOUDINARY_API_KEY
    const apiSecret = process.env.CLOUDINARY_API_SECRET

    if (cloudName && apiKey && apiSecret) {
      // Perform signed upload to Cloudinary via REST API
      const timestamp = Math.round(Date.now() / 1000).toString()
      const folder = 'kiswa_offer_bills'
      
      // Sort and sign parameters: folder and timestamp are required
      const paramsToSign = `folder=${folder}&timestamp=${timestamp}`
      const signature = crypto
        .createHash('sha1')
        .update(paramsToSign + apiSecret)
        .digest('hex')

      const cloudinaryFormData = new FormData()
      
      // We convert buffer to a Blob to send it via standard fetch FormData
      const blob = new Blob([buffer], { type: file.type })
      cloudinaryFormData.append('file', blob, file.name)
      cloudinaryFormData.append('api_key', apiKey)
      cloudinaryFormData.append('timestamp', timestamp)
      cloudinaryFormData.append('folder', folder)
      cloudinaryFormData.append('signature', signature)

      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
        {
          method: 'POST',
          body: cloudinaryFormData,
        }
      )

      if (!response.ok) {
        const errText = await response.text()
        console.error('Cloudinary API upload error details:', errText)
        throw new Error(`Cloudinary upload failed: ${response.statusText}`)
      }

      const resData = await response.json()
      return NextResponse.json({
        success: true,
        url: resData.secure_url || resData.url,
      })
    } else {
      // Fallback: Convert buffer to Base64 Data URL and warn.
      // This is a bulletproof fallback that works in read-only serverless environments like Vercel
      // without needing filesystem write permissions, saving the image inline in MongoDB.
      console.warn(
        '⚠️ CLOUDINARY credentials are not configured. Falling back to Base64 Data URL storage. Update .env.local with CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, and CLOUDINARY_API_SECRET.'
      )

      const base64Data = buffer.toString('base64')
      const dataUrl = `data:${file.type || 'image/jpeg'};base64,${base64Data}`

      return NextResponse.json({
        success: true,
        url: dataUrl,
      })
    }
  } catch (error: any) {
    console.error('API Error: /api/offers/upload POST', error)
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}
