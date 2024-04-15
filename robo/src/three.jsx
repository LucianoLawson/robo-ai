import { useEffect, useRef } from 'react';
import * as THREE from 'three';

const Animation = () => {
  const mountRef = useRef(null); // This ref will be used to attach the Three.js scene to the DOM

  useEffect(() => {
    const currentElement = mountRef.current; // Capture the current ref value
    const width = window.innerWidth;
    const height = window.innerHeight;

    // Create a camera
    const camera = new THREE.PerspectiveCamera(70, width / height, 0.01, 10);
    camera.position.z = 1;

    // Create a scene
    const scene = new THREE.Scene();

    // Create a mesh with basic material
    const geometry = new THREE.BoxGeometry(0.2, 0.2, 0.2);
    const material = new THREE.MeshNormalMaterial();
    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    // Setup the renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(width, height);

    // Attach the renderer to the DOM element provided by the ref
    currentElement.appendChild(renderer.domElement);

    // Animation loop
    const onAnimate = () => {
      mesh.rotation.x += 0.01;
      mesh.rotation.y += 0.01;
      renderer.render(scene, camera);
    };

    // Set animation loop
    renderer.setAnimationLoop(onAnimate);

    // Cleanup function
    return () => {
      renderer.setAnimationLoop(null); // Stop the animation loop
      if (currentElement) currentElement.removeChild(renderer.domElement); // Safely remove the renderer from the DOM
      scene.remove(mesh); // Clean up the mesh from the scene
      geometry.dispose(); // Dispose the geometry
      material.dispose(); // Dispose the material
    };
  }, []); // The empty dependency array means this effect will only run once (like componentDidMount)

return <div ref={mountRef} />;
};

export default Animation;
