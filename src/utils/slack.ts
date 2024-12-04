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

  console.log('Sending to Slack:', message); // Debug log

  try {
    const response = await fetch(WEBHOOK_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(message),
    });
    
    if (!response.ok) {
      console.error('Slack response not OK:', await response.text()); // Debug log
      throw new Error('Failed to send to Slack');
    }

    console.log('Successfully sent to Slack'); // Debug log
  } catch (error) {
    console.error('Error sending to Slack:', error);
    throw error;
  }
};