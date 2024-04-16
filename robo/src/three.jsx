import { useEffect, useRef } from 'react';
import * as THREE from 'three';
/* import { FontLoader } from 'three/examples/jsm/loaders/FontLoader';
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry'; */

const Animation = () => {
  const mountRef = useRef(null);

  useEffect(() => {
    const currentElement = mountRef.current;
    const width = window.innerWidth;
    const height = window.innerHeight;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(70, width / height, 0.01, 10);
    camera.position.z = 1;

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(width, height);
    currentElement.appendChild(renderer.domElement);

    /* const fontLoader = new FontLoader();
    let textMesh;

    // Load a font
    fontLoader.load('../helvetiker_regular.typeface.json', (font) => {
      const textGeometry = new TextGeometry('Welcome to Robo Chat', {
        font: font,
        size: 0.1,
        height: 0.05,
        curveSegments: 12,
        bevelEnabled: true,
        bevelThickness: 0.01,
        bevelSize: 0.01,
        bevelSegments: 3,
      });
      const textMaterial = new THREE.MeshNormalMaterial();
      textMesh = new THREE.Mesh(textGeometry, textMaterial);
      textMesh.position.x = -0.5; // Adjust text position
      textMesh.position.y = 0.2; // Adjust text position
      scene.add(textMesh);
    }, undefined, function (error) {
      console.error('An error happened during the font loading.', error);
    }); */

    const geometry = new THREE.BoxGeometry(0.2, 0.2, 0.2);
    const material = new THREE.MeshNormalMaterial();
    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

/*     const onAnimate = () => {
      if (textMesh) {
        textMesh.rotation.x += 0.0;
        textMesh.rotation.y += 0.0;
      }
      mesh.rotation.x += 0.01;
      mesh.rotation.y += 0.01;
      renderer.render(scene, camera);
    };

    renderer.setAnimationLoop(onAnimate); */

    return () => {
      renderer.setAnimationLoop(null);
      if (currentElement) currentElement.removeChild(renderer.domElement);
      scene.remove(mesh);
      geometry.dispose();
      material.dispose();
/*       if (textMesh) {
        scene.remove(textMesh);
        textMesh.geometry.dispose();
        textMesh.material.dispose();
      } */
    };
  }, []);

  return <div ref={mountRef} />;
};

export default Animation;
