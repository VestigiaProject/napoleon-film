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
          src="https://tfgpqwfabowggaumerqi.supabase.co/storage/v1/object/sign/assets/background.mp4?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJhc3NldHMvYmFja2dyb3VuZC5tcDQiLCJpYXQiOjE3MzgxNzc1ODUsImV4cCI6MTgwMTI0OTU4NX0.MM8QwhXC0qqmoZRwfuraiSaZS94_bUBYv6OY1tQzw50"
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
              <h1 className="text-4xl font-bold tracking-tight uppercase mb-4">
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
                  A tribute to Kubrick's greatest film never made — Napoleon.
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