import express from 'express';
import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

const router = express.Router();

// Form submission endpoint with Cloudflare CAPTCHA validation
router.post('/submit', async (req, res) => {
  try {
    const { 'cf-turnstile-response': cfToken, ...formData } = req.body;

    // Validate Cloudflare CAPTCHA token
    if (!cfToken) {
      return res.status(400).json({ 
        success: false, 
        message: 'CAPTCHA token is required' 
      });
    }

    // Verify CAPTCHA with Cloudflare
    const verificationResponse = await axios.post(
      'https://challenges.cloudflare.com/turnstile/v0/siteverify',
      new URLSearchParams({
        secret: process.env.CF_TURNSTILE_SECRET_KEY || '1x0000000000000000000000000000000AA',
        response: cfToken,
        remoteip: req.ip,
      }),
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      }
    );

    const captchaResult = verificationResponse.data;

    if (!captchaResult.success) {
      return res.status(400).json({ 
        success: false, 
        message: 'CAPTCHA verification failed', 
        errors: captchaResult['error-codes'] 
      });
    }

    const embed = {
      title: 'New Form Submission',
      color: 3447003, // Blue color
      timestamp: new Date().toISOString(),
      fields: []
    };

    // Add form fields to embed
    for (const [key, value] of Object.entries(formData)) {
      embed.fields.push({
        name: key.charAt(0).toUpperCase() + key.slice(1), // Capitalize first letter
        value: typeof value === 'string' ? value.substring(0, 1024) : JSON.stringify(value), // Limit field length
        inline: false
      });
    }

    // Send data to Discord webhook
    const webhookUrl = process.env.DISCORD_WEBHOOK_URL;
    
    if (!webhookUrl) {
      return res.status(500).json({ 
        success: false, 
        message: 'configError'
      });
    }

    await axios.post(webhookUrl, {
      embeds: [embed]
    });

    // Return success response
    res.json({ 
      success: true, 
      message: 'submitted'
    });

  } catch (error) {
    if (error.response?.status === 429) {
      return res.status(429).json({ 
        success: false,
        message: 'rateLimit'
      });
    }
    
    res.status(500).json({ 
      success: false, 
      message: 'serverError'
    });
  }
});

export default router;