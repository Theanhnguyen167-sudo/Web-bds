import { renderToBuffer } from '@react-pdf/renderer';
import { ReportPDFDocument } from '@/components/ai-report/PDFTemplate';
import { NextRequest, NextResponse } from 'next/server';
import React from 'react';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const { report = {}, listing = {}, userName = 'Chuyên viên BĐS Hà Nội' } = body;

    const pdfBuffer = await renderToBuffer(
      React.createElement(ReportPDFDocument, {
        report: report || {},
        listing: listing || {},
        userName: userName || 'Chuyên viên BĐS Hà Nội',
      }) as any
    );

    const safeId = ((report && report.id) || 'report-01').toString().slice(0, 8).toUpperCase();

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

