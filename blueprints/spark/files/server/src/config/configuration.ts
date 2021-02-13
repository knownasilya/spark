export default () => ({
  port: process.env.PORT || '3001',
  googleMapsKey: 'AIzaSyBcjvGysgxPnAXiimyobgidGGm2XWRg4m8',
  security: {
    jwtSecret: process.env.JWT_SECRET || 'gettingTher3JUSTF1n3',
  },
  // default values are test number and test credentials
  twilio: {
    phoneNumber: process.env.TWILIO_PHONE_NUMBER || '+15005550006',
    accountSid:
      process.env.TWILIO_ACCOUNT_SID || 'AC3b1c4604cd64de566cef252f49ceb30d',
    authToken:
      process.env.TWILIO_ACCOUNT_TOKEN || 'ee9e2562404f8ae62149674b10e647eb',
  },
});
