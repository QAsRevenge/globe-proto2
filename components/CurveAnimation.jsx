import React, { useEffect, useRef } from "react";
import * as THREE from "three";

const ObjectAnimation = () => {
  const sceneRef = useRef(null);
  const clock = useRef(new THREE.Clock());
  const objectRef = useRef(null);

  useEffect(() => {
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    camera.position.z = 5;
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    sceneRef.current.appendChild(renderer.domElement);

    const startPosition = new THREE.Vector3(-4, 0, 0);
    const endPosition = new THREE.Vector3(4, 0, 0);
    let currentPosition = startPosition.clone();

    const duration = 5000;
    let elapsedTime = 0;

    const geometry = new THREE.BoxGeometry(1, 1, 1);
    const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
    const object = new THREE.Mesh(geometry, material);
    scene.add(object);
    objectRef.current = object;

    const animate = () => {
      const deltaTime = clock.current.getDelta();
      elapsedTime += deltaTime;

      const t = Math.min(elapsedTime / duration, 1);
      currentPosition.lerpVectors(startPosition, endPosition, t);

      objectRef.current.position.copy(currentPosition);

      renderer.render(scene, camera);

      if (t < 1) {
        requestAnimationFrame(animate);
      }
    };

    animate();

    return () => {
      sceneRef.current.removeChild(renderer.domElement);
    };
  }, []);

  return <div ref={sceneRef} />;
};

export default ObjectAnimation;
