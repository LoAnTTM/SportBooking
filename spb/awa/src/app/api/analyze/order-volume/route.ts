import { NextResponse } from 'next/server';
import { orderVolumeData } from '@/data/mock-data';

export async function GET() {
  try {
    // Here you would typically fetch data from your actual API
    // For example:
    // const response = await fetch('https://your-api-url/analyze/order-volume');
    // const data = await response.json();
    
    // For now, we'll simulate an API call with a delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Simulate API success (in a real app, you'd return the actual API data)
    // For demo purposes, we'll return the mock data
    return NextResponse.json(orderVolumeData);
    
    // In a real implementation, you'd handle the API response and return it
    // return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching order volume data:', error);
    // In case of error, return a 500 status code
    return new NextResponse(JSON.stringify({ error: 'Failed to fetch order volume data' }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }
}
