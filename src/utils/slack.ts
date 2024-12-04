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

  try {
    const response = await fetch(WEBHOOK_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(message)
    });
    
    if (!response.ok) {
      throw new Error(`Failed to send. Status: ${response.status}`);
    }
  } catch (error) {
    console.error('Error details:', {
      message: error instanceof Error ? error.message : 'Unknown error',
      url: WEBHOOK_URL,
    });
    throw error;
  }
};