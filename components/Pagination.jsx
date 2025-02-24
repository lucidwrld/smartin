import * as React from "react";
import Pagination from "@mui/material/Pagination";
import Stack from "@mui/material/Stack";
import PaginationItem from "@mui/material/PaginationItem";
import { BiSolidLeftArrow, BiSolidRightArrow } from "react-icons/bi";

export default function PaginationRounded({ count, onChange, defaultPage }) {
  return (
    <Stack spacing={2}>
      <Pagination
        count={count}
        page={defaultPage} // Add this
        variant="outlined"
        shape="rounded"
        onChange={(e, page) => {
          onChange(page);
        }}
        renderItem={(item) => (
          <PaginationItem
            slots={{ previous: BiSolidLeftArrow, next: BiSolidRightArrow }}
            {...item}
            style={{
              backgroundColor: item.selected ? "#37045D" : "transparent",
              border: "none",
              color: item.selected ? "#FFFFFF" : "#000000",
            }}
          />
        )}
      />
    </Stack>
  );
}
