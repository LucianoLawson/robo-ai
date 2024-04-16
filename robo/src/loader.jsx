import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader';
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry';

const ThreeText = () => {
    const mountRef = useRef(null);

    useEffect(() => {
        const mount = mountRef.current;
        const width = window.innerWidth;
        const height = window.innerHeight;

        // Scene setup
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(70, width / height, 0.01, 10);
        camera.position.set(0, 0, 5);

        // Renderer setup with background color
        const renderer = new THREE.WebGLRenderer({ antialias: true });
        renderer.setClearColor(new THREE.Color(0xcecece)); // Black background
        renderer.setSize(width, height);
        mount.appendChild(renderer.domElement);

        // Cube setup
        const cubeGeometry = new THREE.BoxGeometry(1, 1, 1);
        const cubeMaterial = new THREE.MeshNormalMaterial();
        const cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
        scene.add(cube);

		// Lighting
		const light = new THREE.PointLight(0xffffff, 1.5);
		light.position.set(2, 2, 5);
		scene.add(light);

		// Text setup
		const loader = new FontLoader();
		loader.load('helvetiker_regular.typeface.json', (font) => {
			const textGeometry = new TextGeometry('Loading Robo AI...', {
				font: font,
				size: 0.5,
				depth: 0.2,
				curveSegments: 12,
				bevelEnabled: true,
				bevelThickness: 0.02,
				bevelSize: 0.02,
				bevelSegments: 5,
			});
			const textMaterial = new THREE.MeshNormalMaterial({ color: 'blue' }); // Red text with Phong material
			const textMesh = new THREE.Mesh(textGeometry, textMaterial);
			textMesh.position.set(-2.75, 0.5, 2); // Adjust text position
			scene.add(textMesh);
		});

        // Animation loop
        const animate = () => {
            requestAnimationFrame(animate);
            cube.rotation.x += 0.01;
            cube.rotation.y += 0.01;
            renderer.render(scene, camera);
        };

        // Start animation loop
        animate();

        // Handle resizing
        const onWindowResize = () => {
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(window.innerWidth, window.innerHeight);
        };
        window.addEventListener('resize', onWindowResize);

        // Cleanup function
        return () => {
            mount.removeChild(renderer.domElement);
            window.removeEventListener('resize', onWindowResize);
            scene.clear();
            cubeGeometry.dispose();
            cubeMaterial.dispose();
        };
    }, []);

    return <div ref={mountRef} style={{ width: '100%', height: '100%' }} />;
};

export default ThreeText;
