import { Environment } from "@react-three/drei";
import { MedievalFantasyBook } from "./MedievalFantasyBook";
import { editable as e } from "@theatre/r3f";
import { Autofocus, EffectComposer } from "@react-three/postprocessing";
import { useRef } from "react";
import { Vector3 } from "three";
import { useFrame } from "@react-three/fiber";
import { isProd } from "../App";

export const Experience = () => {
	const focusTargetRef = useRef(new Vector3(0, 0, 0));
	const focusTargetVisualizerRef = useRef();

	useFrame(() => {
		if (focusTargetVisualizerRef.current) {
			focusTargetRef.current.copy(focusTargetVisualizerRef.current.position);
		}
	});

	return (
		<>
			<e.directionalLight
				theatreKey="SunLight"
				position={[3, 3, 3]}
				intensity={0.2}
				castShadow
				shadow-bias={-0.001}
				shadow-mapSize-width={2048}
				shadow-mapSize-height={2048}
			/>
			<e.group theatreKey="MedievalFantasyBook">
				<MedievalFantasyBook scale={0.1} envMapIntensity={0.3} />
			</e.group>
			<Environment preset="dawn" background blur={4} />
			<e.mesh
				theatreKey="Autofocus"
				ref={focusTargetVisualizerRef}
				visible="editor"
			>
				<sphereGeometry args={[0.01, 8, 8]} />
				<meshBasicMaterial color="red" wireframe />
			</e.mesh>
			<EffectComposer>
				<Autofocus
					smoothTime={0.1}
					// debug={isProd ? undefined : 0.04}
					focusRange={0.002}
					bokehScale={8}
					target={focusTargetRef.current}
				/>
			</EffectComposer>
		</>
	);
};
