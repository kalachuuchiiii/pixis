import React from "react";

import {
  Item,
  ItemDescription,
  ItemHeader,
  ItemTitle,
} from "@/components/ui/item";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { TimestampSortControl } from "@/hooks/useTimestampSort";

export const TimestampSort = ({
  handleChangeField,
  handleChangeOrder,
  toReadable,
  timestampField,
  timestampOrder,
}: TimestampSortControl) => {
  return (
    <>
      <Item>
        <ItemHeader>
          <div>
            <ItemTitle>Timestamps</ItemTitle>
            <ItemDescription>Select field to sort</ItemDescription>
          </div>
          <div className="flex gap-1">
            <Select onValueChange={handleChangeField} value={timestampField}>
              <SelectTrigger>
                <SelectValue
                  placeholder={toReadable("createdAt")}
                  defaultValue={"createdAt"}
                />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Fields</SelectLabel>
                  <SelectItem value="createdAt">
                    {toReadable("createdAt")}
                  </SelectItem>
                  <SelectItem value="updatedAt">
                    {toReadable("updatedAt")}
                  </SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
            <Select onValueChange={handleChangeOrder} value={timestampOrder}>
              <SelectTrigger>
                <SelectValue placeholder="Latest First" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Order</SelectLabel>

                  <SelectItem defaultChecked value="desc">
                    {toReadable("desc")}
                  </SelectItem>
                  <SelectItem defaultChecked value="asc">
                    {toReadable("asc")}
                  </SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
        </ItemHeader>
      </Item>
    </>
  );
};
