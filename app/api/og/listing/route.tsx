import { ImageResponse } from '@vercel/og'
import { NextRequest } from 'next/server'

export const runtime = 'edge'

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl
  const title = searchParams.get('title') ?? 'Bất động sản Hà Nội'
  const price = searchParams.get('price') ?? '0'
  const area = searchParams.get('area') ?? '0'
  const district = searchParams.get('district') ?? 'Hà Nội'
  const type = searchParams.get('type') ?? 'house'
  const score = searchParams.get('score') ?? '82'
  const planningZone = searchParams.get('zone') ?? 'Đất ở đô thị'
  const imageUrl = searchParams.get('image') ?? ''

  const formatPrice = (p: string) => {
    const num = parseInt(p, 10)
    if (isNaN(num) || num === 0) return 'Thỏa thuận'
    if (num >= 1000000000) return `${(num / 1000000000).toFixed(1)} TỶ`
    return `${(num / 1000000).toFixed(0)} TRIỆU`
  }

  const typeLabel: Record<string, string> = {
    house: '🏠 Nhà phố',
    apartment: '🏢 Chung cư',
    land: '🌿 Đất nền',
    villa: '🏰 Biệt thự',
  }

  return new ImageResponse(
    (
      <div
        style={{
          width: '1200px',
          height: '630px',
          display: 'flex',
          fontFamily: 'sans-serif',
          backgroundColor: '#0f172a',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Background property image (left side) */}
        {imageUrl ? (
          <div
            style={{
              position: 'absolute',
              left: 0,
              top: 0,
              width: '55%',
              height: '100%',
              backgroundImage: `url(${imageUrl})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}
          />
        ) : null}

        {/* Gradient overlay */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            backgroundImage: imageUrl
              ? 'linear-gradient(to right, rgba(15,23,42,0.2) 0%, rgba(15,23,42,0.92) 50%, #0f172a 100%)'
              : 'linear-gradient(135deg, #1a2744 0%, #0f172a 100%)',
          }}
        />

        {/* Content Right Container */}
        <div
          style={{
            position: 'absolute',
            right: 0,
            top: 0,
            width: '55%',
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            padding: '40px 50px 40px 30px',
          }}
        >
          {/* Logo */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              marginBottom: '20px',
            }}
          >
            <div
              style={{
                width: '36px',
                height: '36px',
                background: '#f97316',
                borderRadius: '10px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '18px',
              }}
            >
              🏠
            </div>
            <span style={{ color: '#f97316', fontSize: '20px', fontWeight: 800 }}>
              HaNoi <span style={{ color: '#ffffff' }}>Realty</span>
            </span>
          </div>

          {/* Property Type & Planning Badges */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              marginBottom: '14px',
            }}
          >
            <div
              style={{
                background: 'rgba(249,115,22,0.2)',
                border: '1px solid rgba(249,115,22,0.4)',
                color: '#f97316',
                fontSize: '13px',
                fontWeight: 700,
                padding: '4px 14px',
                borderRadius: '20px',
              }}
            >
              {typeLabel[type] ?? type}
            </div>
            <div
              style={{
                background: 'rgba(34,197,94,0.2)',
                border: '1px solid rgba(34,197,94,0.4)',
                color: '#22c55e',
                fontSize: '13px',
                fontWeight: 700,
                padding: '4px 14px',
                borderRadius: '20px',
              }}
            >
              🗺️ {planningZone}
            </div>
          </div>

          {/* Title */}
          <div
            style={{
              color: 'white',
              fontSize: '24px',
              fontWeight: 800,
              lineHeight: 1.3,
              marginBottom: '18px',
              display: '-webkit-box',
              WebkitLineClamp: 2,
              overflow: 'hidden',
            }}
          >
            {title}
          </div>

          {/* Price - Highlighted */}
          <div
            style={{
              background: 'linear-gradient(135deg, #f97316, #ea580c)',
              borderRadius: '16px',
              padding: '14px 22px',
              marginBottom: '18px',
              display: 'flex',
              flexDirection: 'column',
              gap: '2px',
              alignSelf: 'flex-start',
            }}
          >
            <span style={{ color: 'rgba(255,255,255,0.75)', fontSize: '11px', fontWeight: 700, letterSpacing: '1px' }}>
              GIÁ BÁN NIÊM YẾT
            </span>
            <span style={{ color: 'white', fontSize: '30px', fontWeight: 900 }}>
              {formatPrice(price)}
            </span>
          </div>

          {/* Stats Row */}
          <div
            style={{
              display: 'flex',
              gap: '12px',
              marginBottom: '18px',
            }}
          >
            {[
              { icon: '📐', value: `${area}m²`, label: 'Diện tích' },
              { icon: '📍', value: district, label: 'Khu vực' },
              { icon: '🤖', value: `${score}/100`, label: 'Điểm AI' },
            ].map((stat) => (
              <div
                key={stat.label}
                style={{
                  background: 'rgba(255,255,255,0.06)',
                  border: '1px solid rgba(255,255,255,0.12)',
                  borderRadius: '12px',
                  padding: '8px 14px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '2px',
                }}
              >
                <span style={{ color: 'rgba(255,255,255,0.55)', fontSize: '10px' }}>
                  {stat.icon} {stat.label}
                </span>
                <span style={{ color: 'white', fontSize: '14px', fontWeight: 700 }}>
                  {stat.value}
                </span>
              </div>
            ))}
          </div>

          {/* CTA */}
          <div
            style={{
              color: 'rgba(255,255,255,0.45)',
              fontSize: '12px',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
            }}
          >
            <span>🔗</span>
            <span>hanoirealty.vn · Tra cứu quy hoạch & thẩm định giá AI</span>
          </div>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  )
}
