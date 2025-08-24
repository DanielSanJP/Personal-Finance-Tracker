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

    // Determine encoding based on file type
    let encoding: 'WEBM_OPUS' | 'MP3' | 'LINEAR16' | 'OGG_OPUS' = 'WEBM_OPUS';
    let sampleRateHertz = 48000;
    
    const mimeType = audioFile.type.toLowerCase();
    console.log('Received audio type:', mimeType);
    
    if (mimeType.includes('webm')) {
      encoding = 'WEBM_OPUS';
      sampleRateHertz = 48000;
    } else if (mimeType.includes('mp4') || mimeType.includes('mp3') || mimeType.includes('mpeg')) {
      encoding = 'MP3';
      sampleRateHertz = 44100;
    } else if (mimeType.includes('wav')) {
      encoding = 'LINEAR16';
      sampleRateHertz = 44100;
    } else if (mimeType.includes('ogg')) {
      encoding = 'OGG_OPUS';
      sampleRateHertz = 48000;
    }

    // Configure the recognition request with dynamic encoding
    const config = {
      encoding,
      sampleRateHertz,
      languageCode: 'en-US',
      enableAutomaticPunctuation: true,
      model: 'latest_short', // Best for short audio clips
      useEnhanced: true, // Better accuracy for mobile audio
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
