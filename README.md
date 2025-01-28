# Napoleon Film Project

A community-driven film project that hosts Kubrick's "Napoleon" script, broken down by shots. Users can contribute AI-generated videos for each shot, vote on their favorites, and watch the entire film in sequence.

## Features

- View the entire script of Kubrick's "Napoleon" broken down by shots
- Community-driven AI-generated video uploads for each shot
- Voting system for the best video renditions
- Sequential playback of the highest-voted videos
- Google Authentication for uploads and voting
- Open-source community contributions

## Tech Stack

- Next.js
- Supabase (Auth, Database, Storage)
- TypeScript
- Tailwind CSS

## Getting Started

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

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is open source and available under the [MIT License](LICENSE).
