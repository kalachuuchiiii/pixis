import React from "react";
import { useActivityQuery } from "../hooks/useActivityQuery";

const MyActivity = () => {
  const { data: activity } = useActivityQuery();
  return <div>MyActivity</div>;
};

export default MyActivity;
