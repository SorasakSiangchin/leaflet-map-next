"use client"

import React, { useState } from 'react'
import SearchLocation from './SearchLocation'
import { Location } from '../interfaces/location';
import Map from './Map';

const MapLocation = () => {
    const [valueStart, setValueStart] = useState<Location | null>(null);
    const [valueEnd, setValueEnd] = useState<Location | null>(null);

    return (
        <div className='w-full flex flex-col gap-3' >
            <div>
                <SearchLocation
                    valueStart={valueStart}
                    setValueStart={setValueStart}
                    valueEnd={valueEnd}
                    setValueEnd={setValueEnd} />
            </div>
            <div>
                <Map valueStart={valueStart} valueEnd={valueEnd} />
            </div>
        </div>
    )
}

export default MapLocation