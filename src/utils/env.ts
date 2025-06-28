// Environment variable utilities
// This file helps you safely access environment variables

export const env = {
  // API Keys
  apiKey: import.meta.env.VITE_API_KEY,
  openaiApiKey: import.meta.env.VITE_OPENAI_API_KEY,
  supabaseUrl: import.meta.env.VITE_SUPABASE_URL,
  supabaseAnonKey: import.meta.env.VITE_SUPABASE_ANON_KEY,
  
  // App Configuration
  appName: import.meta.env.VITE_APP_NAME || 'Future Echoes',
  appVersion: import.meta.env.VITE_APP_VERSION || '1.0.0',
  debugMode: import.meta.env.VITE_DEBUG_MODE === 'true',
  
  // Helper to check if we're in development
  isDev: import.meta.env.DEV,
  isProd: import.meta.env.PROD,
} as const;

// Helper function to validate required environment variables
export const validateEnv = () => {
  const requiredVars = [
    'VITE_API_KEY',
    'VITE_OPENAI_API_KEY',
    'VITE_SUPABASE_URL',
    'VITE_SUPABASE_ANON_KEY'
  ];
  
  const missing = requiredVars.filter(varName => !import.meta.env[varName]);
  
  if (missing.length > 0) {
    console.warn('Missing environment variables:', missing);
    return false;
  }
  
  return true;
};