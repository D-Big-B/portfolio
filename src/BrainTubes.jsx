import * as THREE from "three";
import { extend } from "@react-three/fiber";
import { useRef } from "react";
import { shaderMaterial } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useThree } from "react-three-fiber";

function Tube({ curve }) {
  const brainMat = useRef();
  const { viewport } = useThree();
  useFrame(({ clock }) => {
    brainMat.current.uniforms.time.value = clock.getElapsedTime();
  });

  const BrainMaterial = shaderMaterial(
    { time: 0, color: new THREE.Color(0.1, 0.3, 0.6) },
    // vertex shader
    /*glsl*/ `
    varying vec2 vUv;
    uniform float time;
    uniform vec3 mouse;
    varying float vProgress;

    void main() {
      vProgress = smoothstep(-1.,1.,sin(vUv.x*8. + time*2.));
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
    // fragment shader
    /*glsl*/ `
    uniform float time;
    uniform vec3 color;
    varying vec2 vUv;
    varying float vProgress;
    void main() {
      vec3 finalColor = mix(color, color*0.25, vProgress);
      float hideCorners = smoothstep(1.,0.9,vUv.x);
      float hideCorners1 = smoothstep(0.,0.1,vUv.x);

      gl_FragColor.rgba = vec4(finalColor,hideCorners*hideCorners1);
    }
  `
  );

  extend({ BrainMaterial });
  return (
    <>
      <mesh>
        <tubeGeometry args={[curve, 64, 0.001, 2, false]} />
        <brainMaterial
          ref={brainMat}
          side={THREE.DoubleSide}
          transparent={true}
          depthTest={false}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </mesh>
    </>
  );
}

function Tubes({ brainCurves }) {
  return (
    <>
      {brainCurves.map((curve, index) => (
        <Tube curve={curve} key={index} />
      ))}
    </>
  );
}

export default Tubes;
