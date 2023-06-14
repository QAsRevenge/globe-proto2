import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import gsap from "gsap";
import { markerSvg } from "./markerSvg";
import Globe from "react-globe.gl";

export const World = () => {
  const globeEl = useRef();

  // Gen random data
  const N = 30;
  const gData = [...Array(N).keys()].map(() => ({
    lat: (Math.random() - 0.5) * 180,
    lng: (Math.random() - 0.5) * 360,
    size: 7 + Math.random() * 30,
    color: ["red", "white", "blue", "green"][Math.round(Math.random() * 3)],
  }));

  useEffect(() => {
    const globe = globeEl.current;

    //Frustum culling to prevent render failure

    // Auto-rotate
    globe.controls().autoRotate = false;
    globe.controls().autoRotateSpeed = 0.1;
    const mapRotation = -0.003;
    const mapAlt = 0.006;
    // globe.scene(function (globe) {
    //   globe.frustumCulled = false;
    // });

    const mapImgUrl = "/files/ColorMap.jpg";

    new THREE.TextureLoader().load(mapImgUrl, (mapTexture) => {
      const map = new THREE.Mesh(
        new THREE.SphereGeometry(globe.getGlobeRadius() * (1 + mapAlt), 75, 75),
        new THREE.MeshPhongMaterial({
          map: mapTexture,
          depthWrite: true,
        })
      );
      globe.scene().add(map);
      (function rotateWorld() {
        map.rotation.y += (mapRotation * Math.PI) / 180;
        requestAnimationFrame(map);
      });
    });

    // Add clouds sphere
    const CLOUDS_IMG_URL = "/files/clouds.png"; // from https://github.com/turban/webgl-earth
    const CLOUDS_ALT = 0.01;
    const CLOUDS_ROTATION_SPEED = -0.003; // deg/frame

    new THREE.TextureLoader().load(CLOUDS_IMG_URL, (cloudsTexture) => {
      const clouds = new THREE.Mesh(
        new THREE.SphereGeometry(
          globe.getGlobeRadius() * (1 + CLOUDS_ALT),
          75,
          75
        ),
        new THREE.MeshPhongMaterial({
          map: cloudsTexture,
          transparent: true,
          depthWrite: false,
        })
      );
      globe.scene().add(clouds);

      (function rotateClouds() {
        clouds.rotation.y += (CLOUDS_ROTATION_SPEED * Math.PI) / 180;
        requestAnimationFrame(rotateClouds);
      })();
    });
  }, []);

  return (
    <Globe
      ref={globeEl}
      animateIn={false}
      htmlElementsData={gData}
      htmlElement={(d) => {
        const el = document.createElement("div");
        el.innerHTML = markerSvg;
        el.style.color = d.color;
        el.style.width = `${d.size}px`;

        el.style["pointer-events"] = "auto";
        el.style.cursor = "pointer";
        el.onclick = () => console.info(d);
        return el;
      }}
    />
  );
};
