import { useMemo, useState } from "react";

type TimestampFields = "createdAt" | "updatedAt";
type TimestampOrder = "asc" | "desc";
export const useTimestampSort = () => {
  const [timestampField, setTimestampField] =
    useState<TimestampFields>("createdAt");
  const [timestampOrder, setTimestampOrder] = useState<TimestampOrder>("desc");

  const handleChangeOrder = (val: TimestampOrder) => {
    setTimestampOrder(val);
  };

  const handleChangeField = (val: TimestampFields) => {
    setTimestampField(val);
  };

  const timestampSortParam = useMemo(() => {
    if (timestampOrder === "asc") {
      return timestampField;
    }

    return `-${timestampField}`;
  }, [timestampField, timestampOrder]);

  const toReadable = (val: TimestampFields | TimestampOrder) => {
    if (val === "asc") {
      return "Oldest First";
    }
    if (val === "desc") {
      return "Newest First";
    }
    if (val === "createdAt") {
      return "Creation Date";
    }
    return "Updated Date";
  };

  return {
    handleChangeField,
    handleChangeOrder,
    timestampSortParam,
    timestampOrder,
    toReadable,
    timestampField,
  };
};

export type TimestampSortControl = ReturnType<typeof useTimestampSort>;
