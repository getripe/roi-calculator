const BASE_URL = 'https://90dd046a-a846-4e8f-a2b2-c59236be341b.lovableproject.com';

export const sendToSlack = async (data: {
  domain: string;
  qualifiedSignups: number;
  revenuePerDeal: number;
  closeRate: string;
}) => {
  const params = new URLSearchParams({
    company: data.domain,
    qualified: data.qualifiedSignups.toString(),
    contract: data.revenuePerDeal.toString(),
    rate: data.closeRate
  });

  const url = `${BASE_URL}?${params.toString()}`;
  
  console.log('Sending to URL:', url); // Detailed logging

  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      mode: 'no-cors',
    });
    
    console.log('Response status:', response.status); // Log response status

    if (!response.ok && response.status !== 0) { // status 0 is expected with no-cors
      const errorText = await response.text();
      console.error('Response not OK:', errorText);
      throw new Error(`Failed to send. Status: ${response.status}, Error: ${errorText}`);
    }

    console.log('Successfully sent');
  } catch (error) {
    console.error('Detailed error:', error);
    console.error('Error details:', {
      message: error instanceof Error ? error.message : 'Unknown error',
      url: url,
    });
    throw error;
  }
};