import { lazy } from "react";
import { Outlet, useRoutes, type RouteObject } from "react-router-dom";
import AppErrorBoundary from "./AppErrorBoundary";
import DeckFlashcards from "@/features/deck/pages/DeckFlashcards";
import DeckLeaderboards from "@/features/leaderboards/pages/DeckLeaderboards";
import DeckSessionHistory from "@/features/session/pages/DeckSessionHistory";
import ExploreCollections from "@/features/collection/pages/ExploreCollections";
import { AssistantLayout } from "@/features/assistant/components/AssistantLayout";

import ProfileDetails from "@/features/account/components/ProfileDetails";
import DeckHistory from "@/features/deck/pages/DeckHistory";
import ProfileStats from "@/features/account/pages/ProfileStats";
import Decks from "@/features/deck/pages/Decks";
import Collections from "@/features/collection/pages/Collections";
import { GuestGuard } from "@/components/guards/GuestGuard";
import { AuthGuard } from "@/features/auth/components/guards/AuthGuard";
import NotFound from "@/pages/NotFound";
import { GuestLayout } from "@/components/ui/GuestLayout";

import StudyTechniques from "@/features/guides/pages/StudyTechniques";
import Documentation from "@/features/guides/pages/Documentation";
import { GuidesLayout } from "@/features/guides/components/ui/GuidesLayout";
import LandingPage from "@/pages/LandingPage";
import People from "@/features/account/pages/People";
const Layout = lazy(() => import("@/features/auth/components/Layout"));
const SignIn = lazy(() => import("@/features/auth/pages/SignIn"));
const SignUp = lazy(() => import("@/features/auth/pages/SignUp"));

const AppLayout = lazy(() => import("@/components/ui/AppLayout"));

const Settings = lazy(() => import("@/features/account/pages/Settings"));
const Leaderboard = lazy(
  () => import("@/features/leaderboards/pages/Leaderboard")
);
const Dashboard = lazy(() => import("@/features/dashboard/pages/Dashboard"));
const Assistant = lazy(() => import("@/features/assistant/pages/Assistant"));

const CollectionDetails = lazy(
  () => import("@/features/collection/pages/CollectionDetails")
);
const MyCollections = lazy(
  () => import("@/features/collection/pages/Collections")
);

const ArchivedDecks = lazy(() => import("@/features/deck/pages/ArchivedDecks"));
const DeckDetails = lazy(
  () => import("@/features/deck/components/layout/DeckDetails")
);
const ExploreDecks = lazy(() => import("@/features/deck/pages/ExploreDecks"));

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
    element: <GuestLayout />,
    children: [
      {
        path: "/",
        element: <LandingPage />,
      },
      {
        path: "*",
        element: <NotFound />,
      },
    ],
  },
  {
    element: <GuidesLayout />,
    children: [
      {
        path: "/documentation",
        element: <Documentation />,
      },
      {
        path: "/study",
        element: <StudyTechniques />,
      },
    ],
  },
  {
    element: (
      <GuestGuard>
        <Layout />
      </GuestGuard>
    ),
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
    element: wrap(
      <AuthGuard>
        <Exam />
      </AuthGuard>
    ),
  },
  {
    element: (
      <AuthGuard>
        <AssistantLayout />
      </AuthGuard>
    ),
    children: [
      {
        path: "/app/chat/:conversationId",
        element: <Assistant />,
      },
      {
        path: "/app/chat/",
        element: <Assistant />,
      },
    ],
  },

  {
    element: (
      <AuthGuard>
        <AppLayout />
      </AuthGuard>
    ),
    children: [
      {
        element: wrap(<Outlet />),
        children: [
          {
            path: "/app/people",
            element: <People />,
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
            path: "/app/dashboard",
            element: <Dashboard />,
          },
          {
            path: "/app/leaderboard",
            element: <Leaderboard />,
          },
          {
            path: "/app/explore/decks",
            element: <ExploreDecks />,
          },
          {
            path: "/app/explore/collections",
            element: <ExploreCollections />,
          },
          {
            element: <ProfileDetails />,
            children: [
              {
                path: "/app/profile/:userId/history",
                element: <DeckHistory />,
              },
              {
                path: "/app/profile/:userId/stats",
                element: <ProfileStats />,
              },
              {
                path: "/app/profile/:userId/decks",
                element: <Decks />,
              },
              {
                path: "/app/profile/:userId/collections",
                element: <Collections />,
              },
            ],
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
