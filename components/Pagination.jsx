import * as React from 'react';
import Pagination from '@mui/material/Pagination';
import Stack from '@mui/material/Stack';
import PaginationItem from '@mui/material/PaginationItem';
import { BiSolidLeftArrow, BiSolidRightArrow } from 'react-icons/bi'

export default function PaginationRounded({ count, onChange }) {
    return (
        <Stack spacing={2}>
            <Pagination
                count={count}
                variant="outlined"
                shape="rounded"
                onChange={(e, page) => {
                    onChange(page)
                }}
                renderItem={(item) => (
                    <PaginationItem
                        slots={{ previous: BiSolidLeftArrow, next: BiSolidRightArrow }}
                        {...item}
                        style={{
                            backgroundColor: item.selected ? '#358619' : 'transparent',
                            border: 'none'
                        }}
                    />
                )}
            />
        </Stack>
    );
}
