import { useRef, useEffect } from "react";
import Globe from "react-globe.gl";
import * as THREE from "three";

const color = () => {
  return "#83d4f0";
};

export function World() {
  const globeEl = useRef();

  const N = 5;
  const arcsData = [...Array(N).keys()].map(() => ({
    startLat: 57.5,
    startLng: 13,
    endLat: (Math.random() - 0.5) * 180 * 2,
    endLng: (Math.random() - 0.5) * 360,
    color: [
      ["blue", "green"][Math.round(Math.random() * 2)],
      ["blue", "green"][Math.round(Math.random() * 1)],
    ],
  }));

  useEffect(() => {
    const globe = globeEl.current;
    globe.controls().autoRotate = false;
    globe.controls().autoRotateSpeed = 0.15;
  }, [globeEl]);

  return (
    <>
      <Globe
        ref={globeEl}
        globeImageUrl={
          "//unpkg.com/three-globe/example/img/earth-blue-marble.jpg"
        }
        bumpImageUrl={"//unpkg.com/three-globe/example/img/earth-topology.png"}
        backgroundImageUrl={"night-sky.png"}
        arcsData={arcsData}
        arcColor={color}
        arcAltitude={0.3}
        arcDashGap={1}
        arcDashAnimateTime={3400}
        arcStroke={0.5}
      />
    </>
  );
}
