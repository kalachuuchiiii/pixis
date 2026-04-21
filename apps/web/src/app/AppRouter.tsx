import AppLayout from "@/components/ui/AppLayout";
import MyProfile from "@/features/account/pages/MyProfile";
import Settings from "@/features/account/pages/Settings";
import Leaderboard from "@/features/activity/pages/Leaderboard";
import MyActivity from "@/features/activity/pages/MyActivity";
import Assistant from "@/features/assistant/pages/Assistant";
import Layout from "@/features/auth/components/Layout";
import SignIn from "@/features/auth/pages/SignIn";
import SignUp from "@/features/auth/pages/SignUp";
import CollectionDetails from "@/features/collection/pages/CollectionDetails";
import MyCollections from "@/features/collection/pages/MyCollections";
import ArchivedDecks from "@/features/deck/pages/ArchivedDecks";
import DeckDetails from "@/features/deck/pages/DeckDetails";
import MyDecks from "@/features/deck/pages/MyDecks";
import PublicDecks from "@/features/deck/pages/PublicDecks";
import FlashcardList from "@/features/flashcard/pages/FlashcardList";
import LandingPage from "@/pages/LandingPage";
import { useRoutes, type RouteObject } from "react-router-dom";

const routes: RouteObject[] = [
  {
    element: <LandingPage />,
    path: '/'
  }, 
  {
    element: <Layout />,
    children: [
      {
        element: <SignIn />,
        path: "/sign-in",
      },
      {
        element: <SignUp />,
        path: "/sign-up",
      },
    ],
  },
  {
    element: <AppLayout />,
    children: [
      
      {
         element: <CollectionDetails />,
         path: `/app/collections/:collectionId`
      },
      {
         element: <MyCollections />,
         path: '/app/collections'
      },
      {
          element: <DeckDetails />,
          path: '/app/decks/:deckId'
      },
      {
        element: <ArchivedDecks />,
        path: '/app/archived/decks'
      },
      {
        element: <Assistant />,
        path: '/app'
      },
      {
        element: <MyDecks />,
        path: '/app/decks'
      },
      {
        element: <MyActivity />,
        path: '/app/activity'
      },
      {
        element: <Leaderboard />,
        path: '/app/leaderboard'
      },
      {
        element: <PublicDecks />,
        path: '/app/explore'
      },
      {
        element: <MyProfile />,
        path: '/app/profile'
      },
      {
        element: <Settings />,
        path: '/app/settings'
      },
       {
        element: <FlashcardList />,
        path: '/app/decks/:deckId/manage/flashcards'
      },
    ]
  }
];


const AppRouter = () => {
  return useRoutes(routes);
};

export default AppRouter;
