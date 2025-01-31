import Head from 'next/head';
import Link from 'next/link';
import Header from '../components/Header';

export default function Home() {
  return (
    <>
      <Head>
        <title>Napoleon Film Project</title>
        <meta name="description" content="A community-driven film project about Napoleon" />
      </Head>

      {/* Header */}
      <div className="fixed top-0 left-0 right-0 z-20 bg-white bg-opacity-90 backdrop-blur-sm">
        <Header />
      </div>

      {/* Video Background */}
      <div className="fixed inset-0 w-full h-full z-0">
        <video
          autoPlay
          muted
          loop
          playsInline
          className="w-full h-full object-cover blur-sm"
          src="https://tfgpqwfabowggaumerqi.supabase.co/storage/v1/object/sign/assets/Background2.mp4?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJhc3NldHMvQmFja2dyb3VuZDIubXA0IiwiaWF0IjoxNzM4MzAzMzY2LCJleHAiOjIwNTM2NjMzNjZ9.-Ofm280HRVFsLnjvjZ0kjTbAdqzK-IZQ0B_unhCJeF0"
        />
        <div className="absolute inset-0 bg-black bg-opacity-70" />
      </div>

      {/* Content */}
      <div className="relative z-10 pt-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 min-h-[calc(100vh-64px)]">
          <div className="py-16 font-mono text-white">
            {/* Script Header */}
            <div className="text-center border-b-2 border-gray-500 pb-8 mb-8">
              <div className="uppercase text-sm tracking-widest mb-4">FADE IN:</div>
              <h1 className="text-4xl font-bold mb-4">
                NAPOLEON
              </h1>
              <div className="text-sm uppercase tracking-widest">
                A Community-Driven Film Project
              </div>
            </div>

            {/* Script Body */}
            <div className="max-w-2xl mx-auto text-center mb-12">
              <div className="mb-8">
                <div className="uppercase text-sm tracking-widest mb-2">SCENE 1</div>
                <p className="text-lg leading-relaxed">
                  A tribute to Kubrick&apos;s greatest film never made — Napoleon.
                  <br />
                  A collaborative film project using generative AI.
                </p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-6">
              <Link
                href="/shots"
                className="px-8 py-3 bg-transparent text-white font-mono uppercase tracking-wider text-sm hover:bg-white hover:bg-opacity-10 transition-colors border-2 border-white"
                legacyBehavior={false}
              >
                Contribute
              </Link>
              <a
                href="https://discord.gg/FeJz9gtXF4"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center px-8 py-3 bg-transparent text-white font-mono uppercase tracking-wider text-sm hover:bg-white hover:bg-opacity-10 transition-colors border-2 border-white"
              >
                <svg
                  className="w-5 h-5 mr-2"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515a.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0a12.64 12.64 0 0 0-.617-1.25a.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057a19.9 19.9 0 0 0 5.993 3.03a.078.078 0 0 0 .084-.028a14.09 14.09 0 0 0 1.226-1.994a.076.076 0 0 0-.041-.106a13.107 13.107 0 0 1-1.872-.892a.077.077 0 0 1-.008-.128a10.2 10.2 0 0 0 .372-.292a.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127a12.299 12.299 0 0 1-1.873.892a.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028a19.839 19.839 0 0 0 6.002-3.03a.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.956-2.419 2.157-2.419c1.21 0 2.176 1.096 2.157 2.42c0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.955-2.419 2.157-2.419c1.21 0 2.176 1.096 2.157 2.42c0 1.333-.946 2.418-2.157 2.418z"/>
                </svg>
                Join Discord
              </a>
            </div>

            {/* Script Footer */}
            <div className="text-center mt-12 uppercase text-sm tracking-widest text-gray-300">
              FADE OUT.
            </div>
          </div>
        </div>
      </div>
    </>
  );
} 