# Napoleon Film Project

A community-driven film project to adapt a movie script, broken down by shots. Users can contribute AI-generated videos for each shot, vote on their favorites, and watch the entire film in sequence.

## Features

- View an entire script broken down by shots
- Community-driven AI-generated video uploads for each shot
- Voting system for the best video renditions
- Sequential playback of the highest-voted videos
- Google Authentication for uploads and voting
- Open-source community contributions

## User Guide

### Getting Started

1. You can visit the website and browse through the available shots without signing in
2. To contribute or vote, click the "Sign In" button in the top right corner
3. Sign in using a Google account

### Viewing Shots

- **Full Film**: This page displays all uploaded shots in sequence
- **Shots**: This page displays all the script's shots in a list. Click on any shot to view all community submissions
- Each shot details page displays:
  - Shot number and name of the scene it takes place in
  - Shot id (different from the shot number: the shot number refers to the place of the shot in the script and can change if new shots are deemed necessary, the shot id is the id of the shot in the database and does not change even if the shot number changes)
  - Script excerpt corresponding to the shot
  - Current best-voted community interpretation (if any)
  - Other submissions

### Contributing Your Videos

1. Navigate to the shot you want to contribute to
2. Click the "[Submit Your Version]" button
3. Upload your AI-generated video (supported formats: MP4, WebM, MOV)
4. Add optional "Director's Notes" to explain your interpretation. It is good practice to include the AI model used, the prompt used, and any other relevant information.
5. Click "Submit" to share your version

Requirements for videos:
- Maximum file size: 50MB
- Recommended resolution: 1080p
- Should match the script excerpt and shot description
- Should have audio effects and voices, but not music, which can cover several shots at once and should be added at the end of the process

### Managing Your Submissions

After uploading, you can:
- Edit your video's description
- Delete your submission if needed
- See how many upvotes your video has received

### Voting System

- Sign in to upvote videos you like
- You can upvote multiple interpretations per shot
- Remove your upvote by clicking again
- The video with the most upvotes becomes the "official" version shown in the film view

### Watching the Film

1. Click "Watch Film" in the navigation
2. Use the autoplay feature to watch continuously
3. Manually navigate between shots using Previous/Next buttons
4. Each shot shows:
   - The highest-voted community interpretation
   - Shot details and script excerpt
   - Creator attribution and vote count

### Best Practices

1. **Quality First**: Focus on creating high-quality interpretations that match the script
2. **Appropriate Content**: Ensure your submissions are appropriate and follow community guidelines
3. **Constructive Participation**: Vote based on quality and accuracy to the script
4. **Respect Copyright**: Only submit AI-generated content you have the right to share
5. **Be Patient**: Allow time for the community to view and vote on new submissions

## For developers:

### Tech Stack

- Next.js
- Supabase (Auth, Database, Storage)
- TypeScript
- Tailwind CSS

### Getting Started

1. Clone the repository
2. Install dependencies:
```bash
npm install
```

3. Create a `.env.local` file with your Supabase credentials:
```bash
NEXT_PUBLIC_SUPABASE_URL=your-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

4. Run the development server:
```bash
npm run dev
```

### Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is open source and available under the [MIT License](LICENSE).
