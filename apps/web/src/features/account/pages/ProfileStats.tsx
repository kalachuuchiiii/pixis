import { getRankIcon } from "@/features/leaderboards/components/Leaderboard";
import React from "react";
import { useProfileDetails } from "../hooks/useProfileDetails";
import { useParams } from "react-router-dom";
import { toOrdinal } from "@/utils/toOrdinal";
import streakFire from "/streak-fire.gif";
import { Skeleton } from "boneyard-js/react";
import { Card } from "@/components/ui/card";
import point from "/point.gif";
import { CrosshairIcon } from "lucide-react";

const ProfileStats = () => {
  const { data: user, isPending } = useProfileDetails();
  return (
    <div className="flex-1 w-full grid lg:text-base text-sm grid-cols-2 lg:grid-cols-3 gap-2 lg:gap-6">
      <Skeleton loading={!user || isPending} name="card">
        <Card className="translate-y-0 flex flex-col justify-between  stat-card hover:border-amber-500/30 transition-colors">
          <div className="flex items-center justify-between">
            <p className=" opacity-50 ">Global Rank </p>{" "}
            {getRankIcon(user.rank)}
          </div>

          <span className="text-lg lg:text-6xl font-semibold avatar-ring tracking-tighter">
            <div className="flex items-center gap-2">
              {toOrdinal(user.rank)} place
            </div>
          </span>

          <span className="stat-card-description tracking-normal ">
            {" "}
            among the <span className="text-amber-400"> 12,453</span> users
          </span>
        </Card>
      </Skeleton>

      <Skeleton loading={!user || isPending} name="card">
        <Card className=" translate-y-2 stat-card hover:border-amber-500/30 transition-colors">
          <div className="flex items-center h-full justify-between">
            <p className=" opacity-50  mb-2">Streak</p>{" "}
            <img src={streakFire} className="size-8 lg:size-12" />
          </div>

          <div className="flex flex-col h-full">
            <div className="flex items-center  font-semibold  tracking-tighter">
              <div className="text-lg lg:text-6xl flex items-center gap-1 tabular-nums">
                <p> {user.streak.currentStreak} day(s)</p>
              </div>
            </div>
            <p className="stat-card-description">answer daily for streaks!</p>
          </div>
        </Card>
      </Skeleton>
      <Skeleton loading={!user || isPending} name="card">
        <Card className=" translate-y-4  hover:border-emerald-500/30 stat-card">
          <div className="flex items-center justify-between w-full">
            <p className=" opacity-50  mb-2">Points</p>{" "}
            <img className="size-8 lg:size-12" src={point} />
          </div>
          <div className="text-lg lg:text-6xl font-semibold flex items-end gap-2  tabular-nums tracking-tighter">
            <p> {user.point.currentPoints} points</p>
          </div>

          <p className="stat-card-description">answer for more points!</p>
        </Card>
      </Skeleton>

      <Skeleton loading={!user || isPending} name="card">
        <Card className="  translate-y-6 lg:translate-y-0 stat-card ">
          <p className=" opacity-50  mb-2">Here since</p>
          <div className="lg:text-5xl text-base font-bold tracking-tight ">
            {new Date(user.createdAt).toDateString()}
          </div>
          <p className="stat-card-description">account creation date</p>
        </Card>
      </Skeleton>

      <Skeleton loading={!user || isPending} name="card">
        <Card className=" translate-y-8 lg:translate-y-2 stat-card">
          <p className=" opacity-50  mb-2">Decks Studied</p>
          <div className="text-lg lg:text-6xl font-semibold flex items-end gap-2">
            {user.deckStudiedCount} decks
          </div>
          <p className="stat-card-description">all decks you've studied</p>
        </Card>
      </Skeleton>

      <Skeleton loading={!user || isPending} name="card">
        <Card className="  translate-y-10 lg:translate-y-4 stat-card">
          <p className=" opacity-50  mb-2">Flashcards answered</p>
          <div className="text-lg lg:text-6xl font-semibold flex items-end gap-2">
            {user.flashcardAnsweredCount} cards
          </div>
          <p className="stat-card-description">repetitions count</p>
        </Card>
      </Skeleton>

      <Skeleton
        loading={!user || isPending}
        name="card"
        className="lg:col-span-3 col-span-2"
      >
        <Card className=" translate-y-14 lg:translate-y-4 rotate-1 stat-card ">
          <p className="opacity-50 mb-2">Overall accuracy</p>
          <div className="flex items-baseline gap-3">
            <span className="text-5xl lg:text-7xl font-semibold text-emerald-400">
              {user.averageAccuracy.toFixed(2)}
            </span>
            <span className="text-4xl text-emerald-500/70">%</span>
          </div>
          <p className="stat-card-description">Win rate on all flashcards</p>
        </Card>
      </Skeleton>
    </div>
  );
};

export default ProfileStats;
