import { NextRequest, NextResponse } from 'next/server';
import { SpeechClient } from '@google-cloud/speech';

// Initialize the Google Cloud Speech client
const speechClient = new SpeechClient({
  apiKey: process.env.GOOGLE_CLOUD_API_KEY,
});

export async function POST(request: NextRequest) {
  try {
    // Get audio data from request
    const formData = await request.formData();
    const audioFile = formData.get('audio') as File;
    
    if (!audioFile) {
      return NextResponse.json(
        { error: 'No audio file provided' },
        { status: 400 }
      );
    }

    // Convert audio file to buffer
    const audioBytes = Buffer.from(await audioFile.arrayBuffer());

    // Configure the recognition request
    const config = {
      encoding: 'WEBM_OPUS' as const, // or 'LINEAR16' for WAV
      sampleRateHertz: 48000,
      languageCode: 'en-US',
      enableAutomaticPunctuation: true,
      model: 'latest_short', // Best for short audio clips
    };

    const audio = {
      content: audioBytes.toString('base64'),
    };

    const requestConfig = {
      config,
      audio,
    };

    // Perform speech recognition
    const [response] = await speechClient.recognize(requestConfig);
    
    const transcription = response.results
      ?.map(result => result.alternatives?.[0]?.transcript)
      .filter(Boolean)
      .join(' ') || '';

    if (!transcription) {
      return NextResponse.json(
        { error: 'No speech detected in audio' },
        { status: 400 }
      );
    }

    // Return the transcription
    return NextResponse.json({
      transcript: transcription,
      confidence: response.results?.[0]?.alternatives?.[0]?.confidence || 0,
    });

  } catch (error) {
    console.error('Speech recognition error:', error);
    
    return NextResponse.json(
      { 
        error: 'Speech recognition failed',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
