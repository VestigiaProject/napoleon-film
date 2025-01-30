import Head from 'next/head';
import type { NextPage } from 'next';

const AboutPage: NextPage = () => {
  return (
    <div className="min-h-screen bg-white font-mono">
      <Head>
        <title>About - Napoleon Film Project</title>
        <meta name="description" content="About the Napoleon community film project" />
      </Head>

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="uppercase tracking-wider text-sm mb-4">[About]</div>
            <h1 className="text-2xl uppercase tracking-wide mb-2">Napoleon Film Project</h1>
            <div className="text-gray-600">A community-driven film recreation project</div>
          </div>

          {/* Content Sections */}
          <div className="space-y-12">
            <section>
              <div className="uppercase tracking-wider text-sm mb-4">[The Concept]</div>
              <p className="text-gray-600 mb-6">
                The Napoleon Project is a community-driven film experiment where filmmakers from around 
                the world collaborate to create a unique interpretation of Napoleon&apos;s life story, as a tribute to Stanley Kubrick&apos;s never made Napoleon film. Each 
                shot is open for multiple interpretations made by contributors with generative AI video models, with the community voting on their favorite 
                versions.
              </p>
            </section>

            <section>
              <div className="uppercase tracking-wider text-sm mb-4">[How It Works]</div>
              <div className="space-y-4 text-gray-600">
                <p>
                  1. Each shot from Napoleon is presented with a script excerpt.
                </p>
                <p>
                  2. Filmmakers can submit their interpretation of any shot.
                </p>
                <p>
                  3. The community votes on their favorite interpretations.
                </p>
                <p>
                  4. The most upvoted version becomes part of the final film.
                </p>
              </div>
            </section>

            <section>
              <div className="uppercase tracking-wider text-sm mb-4">[Join The Project]</div>
              <p className="text-gray-600 mb-6">
                Whether you&apos;re a filmmaker, history enthusiast, or just curious, there are many ways 
                to participate:
              </p>
              <ul className="list-none space-y-4 text-gray-600">
                <li>• Submit your own shot interpretation</li>
                <li>• Vote on community submissions</li>
                <li>• Share feedback and discuss interpretations</li>
                <li>• Watch the film evolve as new shots are added</li>
              </ul>
            </section>

            <section>
              <div className="uppercase tracking-wider text-sm mb-4">[Disclaimer]</div>
              <p className="text-gray-600 mb-6">
                This project is a non-commercial, experimental tribute born from our admiration for Stanley Kubrick&apos;s 
                work and historical storytelling. It is an open creative exploration, completely independent and 
                unaffiliated with any rights holders or commercial entities. We receive no funding and generate 
                no revenue. The final film will remain strictly non-commercial and will never be distributed for profit. 
                This is purely a labor of love, created by and for enthusiasts of cinema, history, and collaborative art.
              </p>
            </section>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AboutPage; 