import { lazy } from "react";
import { Outlet, useRoutes, type RouteObject } from "react-router-dom";
import AppErrorBoundary from "./AppErrorBoundary";
import DeckFlashcards from "@/features/deck/pages/DeckFlashcards";
import DeckLeaderboards from "@/features/leaderboards/pages/DeckLeaderboards";
import DeckSessionHistory from "@/features/session/pages/DeckSessionHistory";
import ExploreCollections from "@/features/collection/pages/ExploreCollections";

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
const DeckDetails = lazy(
  () => import("@/features/deck/components/layout/DeckDetails")
);
const MyDecks = lazy(() => import("@/features/deck/pages/MyDecks"));
const PublicDecks = lazy(() => import("@/features/deck/pages/PublicDecks"));

const Exam = lazy(() => import("@/features/exam/pages/Exam"));

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
        element: wrap(<Outlet />),
        children: [
          {
            path: "/app",
            element: <Assistant />,
          },
          {
            path: "/app/saved-collections",
            element: <MySavedCollections />,
          },
          {
            path: "/app/saved-decks",
            element: <MySavedDecks />,
          },
          {
            path: "/app/collections",
            element: <MyCollections />,
          },
          {
            path: "/app/collections/:collectionId",
            element: <CollectionDetails />,
          },
          {
            path: "/app/decks",
            element: <MyDecks />,
          },
          {
            element: <DeckDetails />,
            children: [
              {
                element: wrap(<Outlet />),
                children: [
                  {
                    path: "/app/decks/:deckId/flashcards",
                    element: <DeckFlashcards />,
                  },
                  {
                    path: "/app/decks/:deckId/leaderboards",
                    element: <DeckLeaderboards />,
                  },
                  {
                    path: "/app/decks/:deckId/history",
                    element: <DeckSessionHistory />,
                  },
                ],
              },
            ],
          },
          {
            path: "/app/archived/decks",
            element: <ArchivedDecks />,
          },
          {
            path: "/app/activity",
            element: <MyActivity />,
          },
          {
            path: "/app/leaderboard",
            element: <Leaderboard />,
          },
          {
            path: "/app/explore/decks",
            element: <PublicDecks />,
          },
          {
            path: "/app/explore/collections",
            element: <ExploreCollections />,
          },
          {
            path: "/app/profile",
            element: <MyProfile />,
          },
          {
            path: "/app/settings",
            element: <Settings />,
          },
        ],
      },
    ],
  },
];

const AppRouter = () => {
  return useRoutes(routes);
};

export default AppRouter;
