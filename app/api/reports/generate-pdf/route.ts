import { renderToBuffer } from '@react-pdf/renderer';
import { ReportPDFDocument } from '@/components/ai-report/PDFTemplate';
import { NextRequest, NextResponse } from 'next/server';
import React from 'react';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const { report, listing, userName } = await req.json();

    if (!report || !listing) {
      return NextResponse.json(
        { error: 'Thiếu dữ liệu report hoặc listing' },
        { status: 400 }
      );
    }

    const pdfBuffer = await renderToBuffer(
      React.createElement(ReportPDFDocument, {
        report,
        listing,
        userName: userName || 'Chuyên viên BĐS Hà Nội',
      })
    );

    const safeId = (report.id || 'report-01').slice(0, 8);

    return new NextResponse(pdfBuffer as any, {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="HaNoi-Realty-AI-Report-${safeId}.pdf"`,
        'Content-Length': pdfBuffer.length.toString(),
      },
    });
  } catch (error: any) {
    console.error('PDF generation error:', error);
    return NextResponse.json(
      { error: error?.message || 'PDF generation failed' },
      { status: 500 }
    );
  }
}
