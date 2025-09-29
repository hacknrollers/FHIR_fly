import { NextRequest, NextResponse } from 'next/server';

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent';

interface Message {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  timestamp: Date;
}

const SYSTEM_PROMPT = `You are FHIR Fly Assistant, an expert AI assistant for the FHIR Fly application. You help users with:

1. **FAQs about FHIR Fly**: Features, functionality, how to use the app
2. **Testimonials**: Share positive feedback and success stories
3. **Compliance Questions**: EHR R4, NDHM (National Digital Health Mission) standards
4. **Technical Support**: Troubleshooting, best practices
5. **General Questions**: About the application, terminology, concept mapping

**About FHIR Fly:**
- A comprehensive FHIR-compliant healthcare application
- Supports NAMASTE and ICD-11 terminology mapping
- Built with FastAPI backend and Next.js frontend
- Integrates with Supabase for data storage
- Follows EHR R4 and NDHM compliance standards
- Features include: terminology search, problem lists, analytics, concept mapping

**Key Features:**
- Medical terminology search with NAMASTE and ICD-11 codes
- Concept mapping between different coding systems
- Problem list management
- Analytics and reporting
- Audit logging for compliance
- Modern, responsive UI

**Compliance Standards:**
- EHR R4 (Electronic Health Record Release 4)
- NDHM (National Digital Health Mission) guidelines
- FHIR R4 specification compliance
- Data privacy and security standards

Always be helpful, accurate, and professional. If you don't know something specific about the application, suggest contacting support or checking the documentation.`;

export async function POST(request: NextRequest) {
  try {
    if (!GEMINI_API_KEY) {
      return NextResponse.json(
        { error: 'Gemini API key not configured' },
        { status: 500 }
      );
    }

    const { message, conversationHistory } = await request.json();

    if (!message) {
      return NextResponse.json(
        { error: 'Message is required' },
        { status: 400 }
      );
    }

    // Build conversation context
    const conversationContext = conversationHistory
      ?.map((msg: Message) => `${msg.role === 'user' ? 'User' : 'Assistant'}: ${msg.content}`)
      .join('\n') || '';

    const fullPrompt = `${SYSTEM_PROMPT}

Previous conversation:
${conversationContext}

Current user question: ${message}

Please provide a helpful, accurate response about FHIR Fly, EHR R4, NDHM compliance, or related topics.`;

    const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: fullPrompt
          }]
        }],
        generationConfig: {
          temperature: 0.7,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 1024,
        },
        safetySettings: [
          {
            category: "HARM_CATEGORY_HARASSMENT",
            threshold: "BLOCK_MEDIUM_AND_ABOVE"
          },
          {
            category: "HARM_CATEGORY_HATE_SPEECH",
            threshold: "BLOCK_MEDIUM_AND_ABOVE"
          },
          {
            category: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
            threshold: "BLOCK_MEDIUM_AND_ABOVE"
          },
          {
            category: "HARM_CATEGORY_DANGEROUS_CONTENT",
            threshold: "BLOCK_MEDIUM_AND_ABOVE"
          }
        ]
      }),
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error('Gemini API error:', errorData);
      return NextResponse.json(
        { error: 'Failed to get response from AI' },
        { status: 500 }
      );
    }

    const data = await response.json();
    
    if (!data.candidates || !data.candidates[0] || !data.candidates[0].content) {
      return NextResponse.json(
        { error: 'Invalid response from AI' },
        { status: 500 }
      );
    }

    const aiResponse = data.candidates[0].content.parts[0].text;

    return NextResponse.json({
      response: aiResponse,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Chatbot API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
