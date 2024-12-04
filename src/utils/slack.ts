const WEBHOOK_URL = 'https://hooks.slack.com/services/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';

export const sendToSlack = async (data: {
  domain: string;
  qualifiedSignups: number;
  revenuePerDeal: number;
  closeRate: string;
}) => {
  const messageText = 
    `🎯 New ROI Calculator Share\n` +
    `Domain: ${data.domain}\n` +
    `Qualified Signups: ${data.qualifiedSignups}\n` +
    `Revenue per Deal: $${data.revenuePerDeal}\n` +
    `Close Rate: ${data.closeRate}%`;

  const message = {
    text: messageText
  };

  console.log('Sending to Slack:', JSON.stringify(message)); // Detailed logging

  try {
    const response = await fetch(WEBHOOK_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(message),
      mode: 'no-cors', // Add this to handle cross-origin requests
    });
    
    console.log('Slack response status:', response.status); // Log response status

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Slack response not OK:', errorText);
      throw new Error(`Failed to send to Slack. Status: ${response.status}, Error: ${errorText}`);
    }

    console.log('Successfully sent to Slack');
  } catch (error) {
    console.error('Detailed Slack error:', error);
    console.error('Error details:', {
      message: error instanceof Error ? error.message : 'Unknown error',
      url: WEBHOOK_URL,
    });
    throw error;
  }
};