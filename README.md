<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/drive/1fHVFRqAdRLwfax75pfse1i8NSFG57C1f

## Run Locally

**Prerequisites:**  Node.js

1. Install dependencies:
   ```bash
   npm install
   ```

2. Set the `OPENAI_API_KEY` in `.env.local` to your OpenAI API key:
   ```
   OPENAI_API_KEY=your-openai-api-key-here
   ```

3. Run the app:
   ```bash
   npm run dev
   ```
   
   The app will be available at http://localhost:3018

## Deploy to Vercel

1. Push your code to GitHub (already done)

2. Import your repository to Vercel:
   - Go to [Vercel Dashboard](https://vercel.com/dashboard)
   - Click "Add New" → "Project"
   - Import the `nino-0813/ninoude.saron` repository

3. Configure environment variables:
   - In the Vercel project settings, go to "Environment Variables"
   - Add `VITE_OPENAI_API_KEY` with your OpenAI API key value
   - Or add `OPENAI_API_KEY` (both will work)

4. Deploy:
   - Vercel will automatically detect the Vite configuration
   - Click "Deploy" and wait for the build to complete

**Note:** The `vercel.json` file is already configured for optimal Vite deployment.
