# Doppler Setup Instructions

## Prerequisites
Doppler CLI is already installed (v3.75.1)

## Setup Steps

### 1. Authenticate with Doppler
```bash
doppler login
```
This will open your browser to complete authentication.

### 2. Create the Project (Yes, this can be done via CLI!)
```bash
doppler projects create galaxy-judge --description "Magistrate game - dystopian space station judge simulator"
```

### 3. Setup Local Configuration
```bash
doppler setup
```
Select:
- Project: `galaxy-judge`
- Config: `dev` (or your preferred environment)

### 4. Add Secrets
```bash
doppler secrets set VITE_OPENAI_API_KEY="your_api_key_here"
doppler secrets set VITE_OPENAI_API_ENDPOINT="https://api.openai.com/v1/responses"
doppler secrets set VITE_OPENAI_MODEL="gpt-5-nano"
```

**IMPORTANT**:
- Use the Responses API endpoint: `https://api.openai.com/v1/responses`
- DO NOT use ChatCompletions API: `https://api.openai.com/v1/chat/completions`
- Only use model: `gpt-5-nano`

### 5. Run the App with Doppler
```bash
doppler run -- npm run dev
```

## Verification
To verify your secrets are set correctly:
```bash
doppler secrets
```
