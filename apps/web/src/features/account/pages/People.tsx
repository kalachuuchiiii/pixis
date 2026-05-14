import { AppHeader } from "@/components/ui/AppHeader";
import React, { useState } from "react";
import { useProfileList } from "../hooks/useProfileList";
import { Spinner } from "@/components/ui/spinner";
import { EmptyResource } from "@/components/ui/EmptyResource";
import { ProfileCard } from "../components/ProfileCard";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const People = () => {
  const {
    profiles,
    ref,
    hasNoData,
    onSubmit,
    onEnter,
    hasNoMoreData,
    isPending,
    isFetching,
    handleChangeSearchInput,
    searchInput,
  } = useProfileList();

  const disabled = isFetching || isPending;

  return (
    <div className="page-container">
      <AppHeader
        heading="Find users"
        beside={
          <div className="flex items-center gap-2 ">
            <Input
              onKeyDown={onEnter}
              placeholder="Search here..."
              onChange={handleChangeSearchInput}
              value={searchInput}
              className="my-input "
            />
            <Button onClick={onSubmit} disabled={disabled} className="my-btn ">
              Search
            </Button>
          </div>
        }
        description="Search people by their names or username!"
      />
      <main className="w-full flex flex-col items-start divide-y-1">
        {profiles.map((p) => (
          <ProfileCard user={p} />
        ))}
      </main>
      <footer className="my-20">
        {isPending ? (
          <Spinner />
        ) : hasNoData ? (
          <EmptyResource
            title="Looking for someone?"
            description="Search profiles by username or nickname"
          />
        ) : (
          hasNoMoreData && (
            <EmptyResource
              title="You've reached the end"
              description="No more profiles to show"
            />
          )
        )}
        <div ref={ref} />
      </footer>
    </div>
  );
};

export default People;
