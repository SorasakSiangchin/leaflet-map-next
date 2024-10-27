"use client"

import { Autocomplete, Box, TextField } from '@mui/material';
import React, { useCallback, useEffect, useState } from 'react'
import { Location } from '../interfaces/location';
import _ from 'lodash';

const NOMINATIM_BASE_URL = "https://nominatim.openstreetmap.org/search?";

type Props = {
    valueStart: Location | null
    setValueStart: (value: Location | null) => void
    valueEnd: Location | null
    setValueEnd: (value: Location | null) => void
}

const SearchLocation = ({ valueStart, setValueStart, valueEnd, setValueEnd }: Props) => {
    const [inputValue, setInputValue] = React.useState('');
    const [listLocation, setListLocation] = useState<any[]>([]);
    const [loading, setLoading] = useState<boolean>(false)

    const setLocation = useCallback(_.debounce(async (inputValue: string) => {
        setLoading(true)
        if (inputValue === '') {
            setListLocation([]);
            setLoading(false);
            return undefined;
        }

        const params = new URLSearchParams({
            q: inputValue
            , format: "json"
            , addressdetails: 1
            , polygon_geojson: 0
            , accept_language: "th"
        } as any).toString();

        const url = `${NOMINATIM_BASE_URL}${params}`;
        // console.log("url : ", url)

        const result = await fetch(url, {
            method: 'GET',
            redirect: "follow"
        });

        result.json().then((data) => {
            setListLocation(data);
        });

        setLoading(false);

    }, 400), [])

    useEffect(() => {
        setLocation(inputValue)
    }, [inputValue])


    return (
        <div className='flex flex-col gap-3'>

            <Autocomplete
                noOptionsText="no location"
                options={listLocation}
                loading={loading}
                value={valueStart}
                autoHighlight
                onChange={(event: any, newValue: any | null) => {
                    setListLocation(newValue ? [newValue, ...listLocation] : listLocation);
                    setValueStart(newValue);
                }}
                onInputChange={(_, newInputValue) => {
                    setInputValue(newInputValue);
                }}
                getOptionLabel={(option) =>
                    typeof option === 'string' ? option : option.display_name
                }
                renderOption={(props, option) => {
                    const { key, ...optionProps } = props;
                    return (
                        <Box
                            key={key}
                            component="li"
                            sx={{ '& > img': { mr: 2, flexShrink: 0 } }}
                            {...optionProps}
                        >
                            {option.display_name}
                        </Box>
                    );
                }}
                renderInput={(params) => (
                    <TextField
                        {...params}
                        label="จุดเริ่มต้น"
                        slotProps={{
                            htmlInput: {
                                ...params.inputProps,
                                autoComplete: 'new-password', // disable autocomplete and autofill
                            },
                        }}
                    />
                )}
            />
            <Autocomplete
                noOptionsText="no location"
                options={listLocation}
                loading={loading}
                value={valueEnd}
                autoHighlight
                onChange={(event: any, newValue: any | null) => {
                    setListLocation(newValue ? [newValue, ...listLocation] : listLocation);
                    setValueEnd(newValue);
                }}
                onInputChange={(_, newInputValue) => {
                    setInputValue(newInputValue);
                }}
                getOptionLabel={(option) => option.display_name
                }
                renderOption={(props, option) => {
                    const { key, ...optionProps } = props;
                    return (
                        <Box
                            key={key}
                            component="li"
                            sx={{ '& > img': { mr: 2, flexShrink: 0 } }}
                            {...optionProps}
                        >
                            {option.display_name}
                        </Box>
                    );
                }}
                renderInput={(params) => (
                    <TextField
                        {...params}
                        label="จุดสิ้นสุด"
                        slotProps={{
                            htmlInput: {
                                ...params.inputProps,
                                autoComplete: 'new-password', // disable autocomplete and autofill
                            },
                        }}
                    />
                )}
            />
        </div>
    )
}

export default SearchLocation