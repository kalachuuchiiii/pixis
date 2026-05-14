import { Link } from "react-router-dom";

const Documentation = () => {
  return (
    <div className="min-h-screen 0 text-zinc-900 dark:text-zinc-100">
      <div className="max-w-6xl mx-auto px-6 py-16 leading-relaxed">
        {/* Header */}
        <header className="mb-16">
          <h1 className="text-4xl font-bold tracking-tight mb-4">
            How Pixis Works
          </h1>
          <p className="text-lg text-zinc-600 dark:text-zinc-400">
            Pixis is an AI-powered flashcard system that helps you turn notes
            into structured knowledge and long-term understanding.
          </p>
        </header>

        {/* Getting Started */}
        <section className="mb-14" id="get-started">
          <h2 className="text-2xl font-semibold mb-3">1. Getting Started</h2>
          <p className="text-zinc-700 dark:text-zinc-300">
            To begin,{" "}
            <Link to={`/sign-up`}>
              <span className="text-sky-400">create an account</span>
            </Link>
            . Once signed in, you are taken to your main dashboard where you can
            create decks, view collections, and continue studying immediately.
          </p>
        </section>

        {/* Creating Decks */}
        <section className="mb-14" id="create-decks">
          <h2 className="text-2xl font-semibold mb-3">
            2. Creating Flashcard Decks
          </h2>

          <p className="mb-3 text-zinc-700 dark:text-zinc-300">
            Pixis allows you to generate flashcards in two simple ways:
          </p>

          <p className="text-zinc-700 mb-2 dark:text-zinc-300">
            Create decks and flashcard manually for more control
          </p>

          <p className="text-zinc-700 dark:text-zinc-300">
            or use Pixis and just paste topic such as “Photosynthesis” or “World
            War II”, or paste your own notes. You can also import a PDF (New!)
            The system will then extract key ideas, definitions, and concepts to
            build structured flashcards automatically.
          </p>

          <p className="mt-3 text-zinc-600 dark:text-zinc-400 text-sm">
            The quality of the generated deck depends on the clarity and depth
            of the input material. For PDF ( Pixis can only analyze 1 pdf, and 3
            pages at most )
          </p>
        </section>

        {/* Organizing */}
        <section className="mb-14" id="organize">
          <h2 className="text-2xl font-semibold mb-3">3. Organizing Content</h2>

          <p className="text-zinc-700 dark:text-zinc-300">
            Decks can be saved and grouped into collections. Collections act as
            folders that help you organize your study material by subject,
            semester, or goal. You can keep decks private or share them through
            a link so others can clone and study them.
          </p>
        </section>

        {/* Study Modes */}
        <section className="mb-14" id="study">
          <h2 className="text-2xl font-semibold mb-3">4. Study Modes</h2>

          <p className="text-zinc-700 dark:text-zinc-300 mb-3">
            Pixis currently supports two study modes:
          </p>

          <p className="mb-3">
            <span className="font-medium">Normal Mode</span> is the classic
            flashcard experience where you flip cards at your own pace and build
            familiarity through repetition.
          </p>

          <p>
            <span className="font-medium">Timed Mode</span> adds a countdown
            timer to simulate exam conditions. You answer under time pressure to
            improve recall speed and accuracy.
          </p>

          <p className="mt-3 text-zinc-500 dark:text-zinc-400 text-sm">
            Spaced repetition and advanced learning algorithms are planned for
            future updates.
          </p>
        </section>

        {/* Progress */}
        <section className="mb-14" id="progress">
          <h2 className="text-2xl font-semibold mb-3">5. Progress Tracking</h2>

          <p className="text-zinc-700 dark:text-zinc-300">
            Pixis tracks your study activity including streaks, accuracy, and
            completed sessions. This helps you understand your learning patterns
            and identify weak areas over time.
          </p>
        </section>

        {/* Community */}
        <section className="mb-14">
          <h2 className="text-2xl font-semibold mb-3">
            6. Sharing & Community
          </h2>

          <p className="text-zinc-700 dark:text-zinc-300">
            You can share any deck using a link. Shared decks can be cloned
            instantly, allowing others to study your material without manual
            setup.
          </p>
        </section>

        {/* Footer */}
      </div>
    </div>
  );
};

export default Documentation;
