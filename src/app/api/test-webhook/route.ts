import { NextRequest } from "next/server";

export async function POST(req: NextRequest) {
  console.log('🧪 Test webhook received!');
  console.log('📋 Headers:', Object.fromEntries(req.headers.entries()));
  
  try {
    const body = await req.text();
    console.log('📝 Body:', body);
    
    return new Response(JSON.stringify({ 
      success: true, 
      message: 'Test webhook received successfully',
      timestamp: new Date().toISOString()
    }), {
      status: 200,
      headers: { "content-type": "application/json" },
    });
  } catch (error: any) {
    console.error('❌ Test webhook error:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { "content-type": "application/json" },
    });
  }
}

export async function GET() {
  return new Response(JSON.stringify({ 
    message: 'Test webhook endpoint is working',
    timestamp: new Date().toISOString()
  }), {
    status: 200,
    headers: { "content-type": "application/json" },
  });
}
