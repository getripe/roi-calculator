const WEBHOOK_URL = 'https://hooks.slack.com/services/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';

export const sendToSlack = async (data: {
  domain: string;
  qualifiedSignups: number;
  revenuePerDeal: number;
  closeRate: string;
}) => {
  const message = {
    text: `🎯 New ROI Calculator Share\n` +
          `Domain: ${data.domain}\n` +
          `Qualified Signups: ${data.qualifiedSignups}\n` +
          `Revenue per Deal: $${data.revenuePerDeal}\n` +
          `Close Rate: ${data.closeRate}%`
  };

  try {
    const response = await fetch(WEBHOOK_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(message),
    });
    
    if (!response.ok) {
      throw new Error('Failed to send to Slack');
    }
  } catch (error) {
    console.error('Error sending to Slack:', error);
    throw error;
  }
};