const WEBHOOK_URL = import.meta.env.VITE_SLACK_WEBHOOK_URL;

export const sendToSlack = async (data: {
  domain: string;
  qualifiedSignups: number;
  revenuePerDeal: number;
  closeRate: string;
}) => {
  console.log('Attempting to send to Slack with webhook:', WEBHOOK_URL);
  
  if (!WEBHOOK_URL) {
    console.error('No webhook URL found in environment variables');
    throw new Error('Webhook URL not configured');
  }

  const messageText = 
    `🎯 New ROI Calculator Share\n` +
    `Domain: ${data.domain}\n` +
    `Qualified Signups: ${data.qualifiedSignups}\n` +
    `Revenue per Deal: $${data.revenuePerDeal}\n` +
    `Close Rate: ${data.closeRate}%`;

  const message = {
    text: messageText
  };

  try {
    console.log('Sending message to Slack:', message);
    
    const response = await fetch(WEBHOOK_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(message)
    });
    
    console.log('Slack response status:', response.status);
    
    if (!response.ok) {
      const responseText = await response.text();
      console.error('Slack error response:', responseText);
      throw new Error(`Failed to send. Status: ${response.status}`);
    }

    console.log('Successfully sent message to Slack');
  } catch (error) {
    console.error('Error sending to Slack:', {
      message: error instanceof Error ? error.message : 'Unknown error',
      url: WEBHOOK_URL,
    });
    throw error;
  }
};