"use client";

import { Button } from "@heroui/button";
import { rejects } from "assert";
import { error } from "console";
import mapboxgl from "mapbox-gl";
import { resolve } from "path";
import { useEffect, useState } from "react";
import { useRef } from "react";

type CoordsType = {
  latitude: number;
  longitude: number;
};

function GetGeolocation() {
  return new Promise<CoordsType>((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(
        new Error("Device does not have access to geolocation / not supported")
      );
    } else {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const latitude = position.coords.latitude;
          const longitude = position.coords.longitude;

          resolve({ latitude, longitude });
        },
        (error) => {
          reject(error);
        }
      );
    }
  });
}

function Map() {
  const mapContainer = useRef<HTMLDivElement | null>(null);
  const [worldMap, setWorldMap] = useState<mapboxgl.Map | null>(null);
  const [map, SetOpenMap] = useState<boolean>(false);

  async function GetData() {
    if (!mapContainer.current) return;

    const data = await GetGeolocation();
    console.log(data);

    const accessToken =
      "pk.eyJ1IjoibWloYWkxOTk5IiwiYSI6ImNtZWJtbjdvcDEyMzEyanF1NWpndm9sN2cifQ.ZlW8FV4ziEIQByiqenAd1w";
    mapboxgl.accessToken = accessToken;

    const firstMap = new mapboxgl.Map({
      container: mapContainer.current,
      style: `mapbox://styles/mihai1999/cmebp4qgw00qx01sbfz2kbwcy`,
      center: [data.longitude, data.latitude],
      zoom: 13,
    });

    console.log(firstMap);

    setWorldMap(firstMap);
  }

  function handleButtonPress() {
    SetOpenMap((map) => !map);
    GetData();
  }

  useEffect(() => {
    console.log();
    
    return () => worldMap?.remove();
  }, [worldMap]);

  return (
    <div className="flex flex-col space-y-4 items-center">
      <Button color="primary" variant="shadow" onPressEnd={handleButtonPress}>
        Press to Make Map Appear
      </Button>
      <div className="rounded">
        <div
          ref={mapContainer}
          className="rounded"
          style={{ width: "100%", height: "50vh" }}
        />
      </div>
    </div>
  );
}
export default Map;
