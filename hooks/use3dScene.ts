/* eslint-disable global-require */
import { useEffect } from "react";
import * as THREE from "three";

const use3dScene = (sceneRef) => {
  useEffect(() => {
    if (!sceneRef) return;
    const createScene = () => {
      let { width, height } = {
        width: sceneRef.scrollWidth,
        height: sceneRef.scrollHeight
      }
      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera( 75, width / height, 0.1, 1000 );
      const renderer = new THREE.WebGLRenderer();
      scene.background = new THREE.Color( 0xf1d3f1 );
      renderer.setSize(width, height);
      const ambientLight = new THREE.AmbientLight(0xffffff);
      scene.add(ambientLight);
      camera.position.x = 5;
      camera.position.y = 5;
      camera.position.z = 20;
      const renderScene = () => {
        requestAnimationFrame( renderScene );
        renderer.render( scene, camera );
      }
      renderScene();
      sceneRef.appendChild(renderer.domElement);
      return {
        scene,
        camera
      }
    }
    const renderPlayer = ({ scene }) => {
      const { GLTFLoader } = require("three/examples/jsm/loaders/GLTFLoader");
      const loader = new GLTFLoader();
      let waddle;
      loader.load('/assets/waddle.glb', (gltf) => {
        waddle = gltf.scene;
        scene.add(waddle);
      });
    }
    renderPlayer(createScene());
    //renderPlayer(createScene());
  }, [sceneRef]);
  return;
}

export default use3dScene;