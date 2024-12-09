// import { Canvas, useThree } from "@react-three/fiber";
// import { Controllers, useXR, XR } from "@react-three/xr";
// import React, { useEffect, useRef } from "react";

// const Reticle = () => {
//   const ref = useRef();
//   const { gl } = useThree();
//   const { session } = useXR();

//   useEffect(() => {
//     if (!session || !gl.xr.isPresenting) return;

//     let xrHitTestSource = null;

//     const referenceSpace = gl.xr.getReferenceSpace();

//     const onXRFrame = (time, xrFrame) => {
//       const viewerPose = xrFrame.getViewerPose(referenceSpace);
//       if (!viewerPose || !xrHitTestSource) return;

//       const hitTestResults = xrFrame.getHitTestResults(xrHitTestSource);
//       if (hitTestResults.length > 0) {
//         const hitPose = hitTestResults[0].getPose(referenceSpace);
//         if (hitPose) {
//           ref.current.position.set(
//             hitPose.transform.position.x,
//             hitPose.transform.position.y,
//             hitPose.transform.position.z
//           );
//           ref.current.visible = true;
//         }
//       } else {
//         ref.current.visible = false;
//       }
//     };

//     session.requestReferenceSpace("viewer").then((viewerSpace) => {
//       session.requestHitTestSource({ space: viewerSpace }).then((source) => {
//         xrHitTestSource = source;
//       });
//     });

//     gl.setAnimationLoop(onXRFrame);

//     return () => {
//       if (xrHitTestSource) xrHitTestSource.cancel();
//       gl.setAnimationLoop(null);
//     };
//   }, [gl, session]);

//   return (
//     <mesh ref={ref} visible={false}>
//       <ringBufferGeometry args={[0.1, 0.15, 32]} />
//       <meshBasicMaterial color="blue" />
//     </mesh>
//   );
// };

// const App = () => (
//   <Canvas>
//     <XR>
//       <Controllers />
//       <Reticle />
//     </XR>
//   </Canvas>
// );

// export default App;
