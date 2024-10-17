import { SoftShadows } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { useEffect, useRef, useState } from "react";
import { UI } from "./UI";
import { Experience } from "./components/Experience";

import { editable as e } from "@theatre/r3f";
import { getProject } from "@theatre/core";
import { PerspectiveCamera, SheetProvider } from "@theatre/r3f";
import studio from "@theatre/studio";
import extension from "@theatre/r3f/dist/extension";
import projectState from "./assets/MedievalTown.json";

export const isProd = import.meta.env.PROD === "production";
if (!isProd) {
	studio.initialize();
	studio.extend(extension);
}

const project = getProject(
	"MedievalTownVideo",
	isProd
		? {
				state: projectState,
		  }
		: undefined
);
const mainSheet = project.sheet("Main");

const transitions = {
	Home: [0, 5],
	Castle: [6, 12],
	Windmill: [12, 18],
	Farm: [18, 24],
};

function App() {
	const [currentScreen, setCurrentScreen] = useState("Intro");
	const [targetScreen, setTargetScreen] = useState("Home");
	const cameraTargetRef = useRef();
	const isSetup = useRef(false);

	useEffect(() => {
		project.ready.then(() => {
			if (currentScreen === targetScreen) {
				return;
			}
			if (isSetup.current && currentScreen === "Intro") {
				//Strict mode in development mode causes the useEffect to run twice, so we disable it for the intro
				return;
			}
			isSetup.current = true;
			const transition = transitions[targetScreen];
			if (!transition) {
				return;
			}
			mainSheet.sequence
				.play({
					range: transition,
				})
				.then(() => {
					setCurrentScreen(targetScreen);
				});
		});
	}, [targetScreen]);

	return (
		<>
			<UI
				currentScreen={currentScreen}
				onScreenChange={setTargetScreen}
				isAnimating={currentScreen !== targetScreen}
			/>
			<Canvas
				camera={{ position: [5, 5, 10], fov: 30, near: 1 }}
				shadows
				gl={{ preserveDrawingBuffer: true }}
			>
				<SoftShadows />
				<SheetProvider sheet={mainSheet}>
					<PerspectiveCamera
						position={[5, 5, 10]}
						fov={30}
						near={1}
						makeDefault
						theatreKey="CameraBook"
						lookAt={cameraTargetRef}
					/>
					<e.mesh
						theatreKey="CameraTarget"
						visible="editor"
						ref={cameraTargetRef}
					>
						<octahedronGeometry args={[0.1, 0]} />
						<meshPhongMaterial color="yellow" />
					</e.mesh>
					<Experience />
				</SheetProvider>
			</Canvas>
		</>
	);
}

export default App;
