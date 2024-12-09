import React, { useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import * as THREE from "three";
import { PMREMGenerator } from "three";
import { ARButton } from "three/addons/webxr/ARButton.js";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { RGBELoader } from "three/examples/jsm/loaders/RGBELoader.js"; // HDR loader
import goegap_road from "../../assets/goegap_road_4k.hdr";

const ThreeDModelViewer = () => {
  const location = useLocation();
  let modelUrl = location.state; // Access the model URL from the Link's state

  // Temporarily replace `http` with `https` if needed
  modelUrl =
    modelUrl && modelUrl.startsWith("http://")
      ? modelUrl.replace("http://", "https://")
      : modelUrl;

  const containerRef = useRef(null);
  const rendererRef = useRef(null);
  const sceneRef = useRef(null);
  const cameraRef = useRef(null);
  const reticleRef = useRef(null);
  const hitTestSourceRef = useRef(null);
  const hitTestSourceRequestedRef = useRef(false);

  useEffect(() => {
    let renderer, scene, camera, reticle, controller;
    let model;

    const init = () => {
      // Container for the scene
      const container = containerRef.current;

      // Scene
      scene = new THREE.Scene();
      sceneRef.current = scene;

      // Camera
      camera = new THREE.PerspectiveCamera(
        70,
        window.innerWidth / window.innerHeight,
        0.01,
        20
      );
      cameraRef.current = camera;

      // Lighting for sunset effect
      const light = new THREE.HemisphereLight(0xffffff, 0xbbbbff, 1); // Warm tones for sunset
      light.position.set(1, 1, 1).normalize();
      scene.add(light);

      // Add Ambient Light for a softer glow
      const ambientLight = new THREE.AmbientLight(0xffffff, 1); // Soft warm light
      scene.add(ambientLight);

      // Add lighting
      const hemisphereLight = new THREE.HemisphereLight(0xffffff, 0xffffff, 1); // Soft ambient light
      scene.add(hemisphereLight);

      // HDR Environment Map
      const hdrLoader = new RGBELoader();
      hdrLoader.setDataType(THREE.HalfFloatType);
      hdrLoader.load(goegap_road, (hdrTexture) => {
        const pmremGenerator = new PMREMGenerator(renderer);
        const envMap = pmremGenerator.fromEquirectangular(hdrTexture).texture;

        scene.environment = envMap; // Set the environment map
      });

      // Renderer
      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
      renderer.setPixelRatio(window.devicePixelRatio);
      renderer.setSize(window.innerWidth, window.innerHeight);
      renderer.xr.enabled = true;
      container.appendChild(renderer.domElement);
      rendererRef.current = renderer;

      // AR Button
      const arButton = ARButton.createButton(renderer, {
        requiredFeatures: ["hit-test"],
      });
      document.body.appendChild(arButton);

      // Reticle
      reticle = new THREE.Mesh(
        new THREE.RingGeometry(0.15, 0.2, 32).rotateX(-Math.PI / 2),
        new THREE.MeshStandardMaterial({})
      );
      reticle.matrixAutoUpdate = false;
      reticle.visible = false;
      scene.add(reticle);
      reticleRef.current = reticle;

      // Load Model
      const loader = new GLTFLoader();
      loader.load(modelUrl, (gltf) => {
        model = gltf.scene;
        model.rotation.y = Math.PI / 2; // 90 degrees in radians
        model.visible = false; // Hide the model initially
        scene.add(model);
      });

      // Controller
      controller = renderer.xr.getController(0);
      controller.addEventListener("select", () => onSelect(model));
      scene.add(controller);

      // Event listeners
      window.addEventListener("resize", onWindowResize);

      // Start animation loop
      renderer.setAnimationLoop(animate);
    };

    const onSelect = (model) => {
      if (reticle && reticle.visible && model) {
        reticle.matrix.decompose(model.position, model.quaternion, model.scale);
        model.visible = true; // Make the model visible at the reticle position
      }
    };

    const onWindowResize = () => {
      if (camera && renderer) {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
      }
    };

    const animate = (timestamp, frame) => {
      const renderer = rendererRef.current;

      if (frame) {
        const referenceSpace = renderer.xr.getReferenceSpace();
        const session = renderer.xr.getSession();

        if (!hitTestSourceRequestedRef.current) {
          session.requestReferenceSpace("viewer").then((referenceSpace) => {
            session
              .requestHitTestSource({ space: referenceSpace })
              .then((source) => {
                hitTestSourceRef.current = source;
              });
          });

          session.addEventListener("end", () => {
            hitTestSourceRequestedRef.current = false;
            hitTestSourceRef.current = null;
          });

          hitTestSourceRequestedRef.current = true;
        }

        if (hitTestSourceRef.current) {
          const hitTestResults = frame.getHitTestResults(
            hitTestSourceRef.current
          );

          if (hitTestResults.length > 0) {
            const hit = hitTestResults[0];
            reticle.visible = true;
            reticle.matrix.fromArray(
              hit.getPose(referenceSpace).transform.matrix
            );
          } else {
            reticle.visible = false;
          }
        }
      }

      renderer.render(scene, camera);
    };

    // Initialize the scene
    init();

    // Cleanup on component unmount
    return () => {
      if (renderer) renderer.dispose();
      window.removeEventListener("resize", onWindowResize);
    };
  }, [modelUrl]);

  return <div ref={containerRef} />;
};

export default ThreeDModelViewer;
