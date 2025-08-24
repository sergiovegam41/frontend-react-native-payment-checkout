export const WOMPI_CONFIG = {
  SANDBOX_URL: 'https://api-sandbox.co.uat.wompi.dev/v1',
  PUBLIC_KEY: 'pub_stagtest_g2u0HQd3ZMh05hsSgTS2lUV8t3s4mOt7',
  PRIVATE_KEY: 'prv_stagtest_5i0ZGIGiFcDQifYsXxvsny7Y37tKqFWg',
  EVENTS_KEY: 'stagtest_events_2PDUmhMywUkvb1LvxYnayFbmofT7w39N',
  INTEGRITY_KEY: 'stagtest_integrity_nAIBuqayW70XpUqJS4qf4STYiISd89Fp',
};

export const PAYMENT_STATUS = {
  PENDING: 'PENDING',
  APPROVED: 'APPROVED',
  DECLINED: 'DECLINED',
  ERROR: 'ERROR',
} as const;