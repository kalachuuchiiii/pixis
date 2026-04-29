import { lazy } from "react";
import { useRoutes, type RouteObject } from "react-router-dom";
import AppErrorBoundary from "./AppErrorBoundary";

const LandingPage = lazy(() => import("@/pages/LandingPage"));

const Layout = lazy(() => import("@/features/auth/components/Layout"));
const SignIn = lazy(() => import("@/features/auth/pages/SignIn"));
const SignUp = lazy(() => import("@/features/auth/pages/SignUp"));

const AppLayout = lazy(() => import("@/components/ui/AppLayout"));

const MyProfile = lazy(() => import("@/features/account/pages/MyProfile"));
const Settings = lazy(() => import("@/features/account/pages/Settings"));
const Leaderboard = lazy(() => import("@/features/activity/pages/Leaderboard"));
const MyActivity = lazy(() => import("@/features/activity/pages/MyActivity"));
const Assistant = lazy(() => import("@/features/assistant/pages/Assistant"));

const CollectionDetails = lazy(
  () => import("@/features/collection/pages/CollectionDetails")
);
const MyCollections = lazy(
  () => import("@/features/collection/pages/MyCollections")
);

const ArchivedDecks = lazy(() => import("@/features/deck/pages/ArchivedDecks"));
const DeckDetails = lazy(() => import("@/features/deck/pages/DeckDetails"));
const MyDecks = lazy(() => import("@/features/deck/pages/MyDecks"));
const PublicDecks = lazy(() => import("@/features/deck/pages/PublicDecks"));

const Exam = lazy(() => import("@/features/exam/pages/Exam"));
const FlashcardList = lazy(
  () => import("@/features/flashcard/pages/FlashcardList")
);

const MySavedCollections = lazy(
  () => import("@/features/user-saved-collection/pages/MySavedCollections")
);

const MySavedDecks = lazy(
  () => import("@/features/user-saved-deck/pages/MySavedDecks")
);

const wrap = (element: React.ReactNode) => (
  <AppErrorBoundary>{element}</AppErrorBoundary>
);

const routes: RouteObject[] = [
  {
    path: "/",
    element: <LandingPage />,
  },

  {
    element: <Layout />,
    children: [
      {
        path: "/sign-in",
        element: wrap(<SignIn />),
      },
      {
        path: "/sign-up",
        element: wrap(<SignUp />),
      },
    ],
  },

  {
    path: "/app/exam/:mode/:sessionId",
    element: wrap(<Exam />),
  },

  {
    element: <AppLayout />,
    children: [
      {
        path: "/app",
        element: wrap(<Assistant />),
      },
      {
        path: "/app/saved-collections",
        element: wrap(<MySavedCollections />),
      },
      {
        path: "/app/saved-decks",
        element: wrap(<MySavedDecks />),
      },
      {
        path: "/app/collections",
        element: wrap(<MyCollections />),
      },
      {
        path: "/app/collections/:collectionId",
        element: wrap(<CollectionDetails />),
      },
      {
        path: "/app/decks",
        element: wrap(<MyDecks />),
      },
      {
        path: "/app/decks/:deckId",
        element: wrap(<DeckDetails />),
      },
      {
        path: "/app/decks/:deckId/manage/flashcards",
        element: wrap(<FlashcardList />),
      },
      {
        path: "/app/archived/decks",
        element: wrap(<ArchivedDecks />),
      },
      {
        path: "/app/activity",
        element: wrap(<MyActivity />),
      },
      {
        path: "/app/leaderboard",
        element: wrap(<Leaderboard />),
      },
      {
        path: "/app/explore",
        element: wrap(<PublicDecks />),
      },
      {
        path: "/app/profile",
        element: wrap(<MyProfile />),
      },
      {
        path: "/app/settings",
        element: wrap(<Settings />),
      },
    ],
  },
];

const AppRouter = () => {
  return useRoutes(routes);
};

export default AppRouter;
