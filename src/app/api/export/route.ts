import { NextRequest, NextResponse } from 'next/server';
import { supabaseServer } from '@/lib/supabaseServer';
import { isFeatureAllowed } from '@/lib/stripe';

export async function POST(request: NextRequest) {
  try {
    const supabase = await supabaseServer();
    
    // Get the authenticated user
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check if user has access to data export
    const { data: subscription } = await supabase
      .from('user_subscriptions')
      .select('plan_id')
      .eq('user_id', user.id)
      .single();

    const planId = subscription?.plan_id || 'free';
    
    if (!isFeatureAllowed(planId, 'data_export')) {
      return NextResponse.json(
        { error: 'Data export feature requires Pro or Business plan' },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { format, dateRange, includeTransactions, includeInsights, includeAnalytics, subscriptions, transactions } = body;

    if (format === 'csv') {
      const csvData = generateCSV(subscriptions, transactions, includeTransactions);
      
      return new NextResponse(csvData, {
        headers: {
          'Content-Type': 'text/csv',
          'Content-Disposition': `attachment; filename="subscriptions_export_${new Date().toISOString().split('T')[0]}.csv"`,
        },
      });
    } else if (format === 'pdf') {
      const pdfBuffer = await generatePDF(subscriptions, transactions, {
        includeTransactions,
        includeInsights,
        includeAnalytics: includeAnalytics && planId === 'business',
        dateRange,
        planId
      });
      
      return new NextResponse(pdfBuffer as BodyInit, {
        headers: {
          'Content-Type': 'application/pdf',
          'Content-Disposition': `attachment; filename="subscriptions_report_${new Date().toISOString().split('T')[0]}.pdf"`,
        },
      });
    }

    return NextResponse.json({ error: 'Invalid format' }, { status: 400 });
  } catch (error) {
    console.error('Export error:', error);
    return NextResponse.json({ error: 'Export failed' }, { status: 500 });
  }
}

function generateCSV(subscriptions: any[], transactions: any[], includeTransactions: boolean): string {
  let csv = '';
  
  // Subscription data
  csv += 'Subscription Data\n';
  csv += 'Name,Cadence,Last Amount,Last Date,Confidence,Monthly Estimate\n';
  
  subscriptions.forEach(sub => {
    const monthlyAmount = (sub.lastAmount || 0) * (
      sub.cadence === 'Weekly' ? 4.33 : 
      sub.cadence === 'Daily' ? 30 : 1
    );
    
    csv += `"${sub.name}","${sub.cadence || 'Monthly'}","${sub.lastAmount || 0}","${sub.lastDate || ''}","${Math.round((sub.confidence || 0) * 100)}%","${monthlyAmount.toFixed(2)}"\n`;
  });

  // Summary
  const totalMonthly = subscriptions.reduce((sum, sub) => {
    const amount = sub.lastAmount || 0;
    const multiplier = sub.cadence === 'Weekly' ? 4.33 : 
                     sub.cadence === 'Daily' ? 30 : 1;
    return sum + (amount * multiplier);
  }, 0);

  csv += '\nSummary\n';
  csv += `Total Subscriptions,${subscriptions.length}\n`;
  csv += `Estimated Monthly Cost,$${totalMonthly.toFixed(2)}\n`;
  csv += `Estimated Annual Cost,$${(totalMonthly * 12).toFixed(2)}\n`;

  // Transaction data if requested
  if (includeTransactions && transactions.length > 0) {
    csv += '\n\nTransaction Data\n';
    csv += 'Date,Description,Amount,Account\n';
    
    transactions.slice(0, 1000).forEach(tx => { // Limit to 1000 transactions
      csv += `"${tx.date || ''}","${tx.name || tx.description || ''}","${tx.amount || 0}","${tx.account_id || ''}"\n`;
    });
  }

  return csv;
}

async function generatePDF(
  subscriptions: any[], 
  transactions: any[], 
  options: {
    includeTransactions: boolean;
    includeInsights: boolean;
    includeAnalytics: boolean;
    dateRange: string;
    planId: string;
  }
): Promise<Buffer> {
  // For now, we'll create a simple text-based PDF
  // In a real implementation, you'd use a library like puppeteer or pdfkit
  const PDFDocument = require('pdfkit');
  const doc = new PDFDocument();
  const chunks: Buffer[] = [];

  doc.on('data', (chunk: Buffer) => chunks.push(chunk));
  
  return new Promise((resolve) => {
    doc.on('end', () => resolve(Buffer.concat(chunks)));

    // Header
    doc.fontSize(24).text('Subscription Management Report', { align: 'center' });
    doc.fontSize(12).text(`Generated on ${new Date().toLocaleDateString()}`, { align: 'center' });
    doc.moveDown(2);

    // Executive Summary
    const totalMonthly = subscriptions.reduce((sum, sub) => {
      const amount = sub.lastAmount || 0;
      const multiplier = sub.cadence === 'Weekly' ? 4.33 : 
                       sub.cadence === 'Daily' ? 30 : 1;
      return sum + (amount * multiplier);
    }, 0);

    doc.fontSize(18).text('Executive Summary');
    doc.fontSize(12);
    doc.text(`Total Active Subscriptions: ${subscriptions.length}`);
    doc.text(`Monthly Spending: $${totalMonthly.toFixed(2)}`);
    doc.text(`Annual Spending: $${(totalMonthly * 12).toFixed(2)}`);
    doc.moveDown();

    // Subscriptions List
    doc.fontSize(16).text('Active Subscriptions');
    doc.fontSize(10);
    
    subscriptions.forEach((sub, index) => {
      const monthlyAmount = (sub.lastAmount || 0) * (
        sub.cadence === 'Weekly' ? 4.33 : 
        sub.cadence === 'Daily' ? 30 : 1
      );
      
      doc.text(`${index + 1}. ${sub.name}`);
      doc.text(`   Frequency: ${sub.cadence || 'Monthly'}`);
      doc.text(`   Last Amount: $${sub.lastAmount || 0}`);
      doc.text(`   Monthly Estimate: $${monthlyAmount.toFixed(2)}`);
      doc.text(`   Confidence: ${Math.round((sub.confidence || 0) * 100)}%`);
      doc.moveDown(0.5);
    });

    // Insights section (if requested and available)
    if (options.includeInsights) {
      doc.addPage();
      doc.fontSize(16).text('AI Insights & Recommendations');
      doc.fontSize(12);
      doc.text('Based on your subscription patterns, here are some insights:');
      doc.moveDown();

      // High-cost subscriptions
      const expensiveSubscriptions = subscriptions
        .map(sub => ({
          ...sub,
          monthlyAmount: (sub.lastAmount || 0) * (
            sub.cadence === 'Weekly' ? 4.33 : 
            sub.cadence === 'Daily' ? 30 : 1
          )
        }))
        .filter(sub => sub.monthlyAmount > 20)
        .sort((a, b) => b.monthlyAmount - a.monthlyAmount);

      if (expensiveSubscriptions.length > 0) {
        doc.fontSize(14).text('High-Cost Subscriptions:');
        doc.fontSize(10);
        expensiveSubscriptions.slice(0, 5).forEach(sub => {
          doc.text(`• ${sub.name}: $${sub.monthlyAmount.toFixed(2)}/month`);
        });
        doc.moveDown();
      }

      // Savings opportunities
      doc.fontSize(14).text('Potential Savings Opportunities:');
      doc.fontSize(10);
      doc.text('• Review subscriptions you use less than once per month');
      doc.text('• Look for annual billing discounts on frequently used services');
      doc.text('• Consider family/shared plans for services used by multiple people');
      doc.text('• Cancel duplicate services in the same category');
    }

    // Transaction details (if requested)
    if (options.includeTransactions && transactions.length > 0) {
      doc.addPage();
      doc.fontSize(16).text('Recent Transactions');
      doc.fontSize(8);
      
      transactions.slice(0, 50).forEach(tx => {
        doc.text(`${tx.date || ''} | ${tx.name || tx.description || ''} | $${tx.amount || 0}`);
      });
    }

    // Footer
    doc.fontSize(8).text('Generated by KillSub - AI-Powered Subscription Manager', {
      align: 'center'
    });

    doc.end();
  });
}
