    const requiredEnvVars = [
        'JWT_SECRET',
        'JWT_EXPIRES_IN',
        'DATABASE_URL',
    ];
  
    export const validateEnv = () => {
        const missingVars = requiredEnvVars.filter((key) => !process.env[key]);
    
        if (missingVars.length > 0) {
        console.error('❌ Missing required environment variables:');
        missingVars.forEach((v) => console.error(` - ${v}`));
        process.exit(1); // Exit with failure
        }
    
        console.log('✅ All required environment variables are set.');
    };
  