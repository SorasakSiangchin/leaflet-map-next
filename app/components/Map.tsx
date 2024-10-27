"use client"

import React, { useEffect, useRef, useState } from 'react'
import 'leaflet/dist/leaflet.css';
import 'leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.webpack.css'; // Re-uses images from ~leaflet package
import * as L from 'leaflet';
import 'leaflet-defaulticon-compatibility';
import { MapContainer, TileLayer, useMap, Marker, Popup } from 'react-leaflet'
import { Location } from '../interfaces/location';
import "leaflet-routing-machine/dist/leaflet-routing-machine.css";
import "leaflet-routing-machine";
type Props = {
    valueStart: Location | null
    valueEnd: Location | null
}

const ResetCenterView = ({ valueStart, valueEnd }: Props) => {
    const map = useMap()
    const [waypoints, setWaypoints] = useState<L.LatLng[]>([])

    // 
    const routingControlRef = useRef<L.Routing.Control | null>(null);

    useEffect(() => {
        if (waypoints.length > 0) {
            if (!map) return;

            // เคลียร์ layer
            map.eachLayer((layer) => {
                if (layer instanceof L.Routing.Plan) {
                    map.removeLayer(layer);
                }
            });

            // set layer
            L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
                attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
            }).addTo(map);

            routingControlRef.current = L.Routing.control({
                routeWhileDragging: false, // ปิดการคำนวณเส้นทางแบบ real-time
                show: true,
                addWaypoints: false,
                autoRoute: true, // เปิดใช้งานการคำนวณเส้นทางอัตโนมัติ
                showAlternatives: false // ปิดการแสดงเส้นทางเลือกอื่นๆ
            }).on('routesfound', (e) => {
                const routes = e.routes;
                const summary = routes[0].summary;
                console.log("ระยะทาง (km) ", summary.totalDistance / 1000); // ระยะทางทั้งหมด
                console.log("เวลาทั้งหมด (นาที) ", summary.totalTime / 60); // เวลาทั้งหมด
                console.log(routes[0].coordinates); // พิกัดของแต่ละจุดบนเส้นทาง
            }).addTo(map).setWaypoints(waypoints);
        }
    }, [waypoints])

    const clearRoute = () => {
        if (routingControlRef.current) {
            routingControlRef.current.setWaypoints([]);
        }
    };

    useEffect(() => {
        // ถ้าไมเช็คค่า valueStart และ valueEnd จะทำให้เกิดปัญหาเมื่อมีการเปลี่ยนแปลงค่า
        if (valueEnd && valueStart) {
            clearRoute(); // เคลียร์เส่นทางเก่าทิ้ง
            setWaypoints([
                L.latLng([Number(valueStart?.lat), Number(valueStart?.lon)]),
                L.latLng([Number(valueEnd?.lat), Number(valueEnd?.lon)])
            ])
        }
    }, [map, valueStart, valueEnd])

    return <></>
}

const Map = ({ valueStart, valueEnd }: Props) => {

    const center: L.LatLngTuple = [51.505, -0.09]

    return (
        <div style={{
            width: '100%',
            height: '100vh'
        }} className='border-black'>
            {
                typeof window !== 'undefined' ? <MapContainer center={center} markerZoomAnimation={false} className='w-full h-full' zoom={13}>
                    <TileLayer
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                        url={"https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"}
                    />
                    {valueStart &&
                        <Marker position={[Number(valueStart.lat), Number(valueStart.lon)]} >
                            <Popup>
                                {valueStart.display_name}
                            </Popup>
                        </Marker>
                    }
                    <ResetCenterView valueStart={valueStart} valueEnd={valueEnd} />
                </MapContainer> : ""
            }
        </div>
    )
}

export default Map