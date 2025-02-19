import React, { useState } from "react";

import ReactFullpage from "@fullpage/react-fullpage";
import Header from "components/Header";
import Footer from "components/Footer";
import Location from "components/Location";
import VideoScreen from "./VideoScreen";
import MoneyPot from "./MoneyPot";
import Ira from "./Ira";
import Qosk from "./Qosk";
import Partners from "./Partners";
import MainPress from "./MainPress";
import "styles/overrides.css";
const FULLPAGE_LICENSE_KEY = "10279CE1-488E46AB-917B4BFB-13CAB35A";

const Bottom = () => {
	return (
		<div className="m_section4">
			<Location />
			<Footer />
		</div>
	);
};

const Home = () => {
	const [isVideo, checkVideo] = useState(true);
	const [fullpageApi, setFullpageApi] = useState(null);

	return (
		<div>
			<Header isVideo={isVideo} gotoVideo={fullpageApi} />
			<div className="main_content">
				<ReactFullpage
					checkVideo={checkVideo}
					setFullpageApi={setFullpageApi}
					licenseKey={FULLPAGE_LICENSE_KEY}
					scrollOverflow={true}
					scrollBar={false}
					scrollOverflowReset={true}
					bigSectionsDestination="top"
					scrollOverflowOptions={{ scrollbars: false }}
					afterLoad={(anchorLink, index) => {
						console.log("after Load", { anchorLink, index });
						console.log("after Load  " + index);
						if (anchorLink.index === 0 && index.index === 1) {
							checkVideo(false);
						}
					}}
					onLeave={(origin, destination, direction) => {
						console.log("onLeave event", { origin, destination, direction });
						if (destination.index === 0 && direction === "up") {
							checkVideo(true);
						}
					}}
					render={({ state, fullpageApi }) => {
						setFullpageApi(fullpageApi);
						return (
							<div id="fullpage-wiapper">
								{/* FULL SCREEN VIDEO */}
								<div
									className="section visual_wrap"
									style={{ width: "100vw", maxWidth: "none" }}
								>
									<VideoScreen fullpageApi={fullpageApi} />
								</div>
								{/* MONEYPOT */}
								<div
									className="section m_section1"
									style={{ width: "100vw", maxWidth: "none" }}
								>
									<MoneyPot fullpageApi={fullpageApi} />
								</div>
								{/* IRA */}
								{/* <div
									className="section m_section2"
									style={{ width: "100vw", maxWidth: "none" }}
								>
									<Ira fullpageApi={fullpageApi} />
								</div> */}
								{/* QOSK */}
								{/* <div
									className="section m_section3"
									style={{ width: "100vw", maxWidth: "none" }}
								>
									<Qosk fullpageApi={fullpageApi} />
								</div> */}
								<div
									className="section fp-auto-height"
									style={{ width: "100vw", maxWidth: "none" }}
								>
									<Partners />
								</div>
								<div
									className="section fp-auto-height"
									style={{ width: "100vw", maxWidth: "none" }}
								>
									<MainPress />
								</div>
								<div
									className="section m_section4 fp-auto-height"
									style={{ width: "100vw", maxWidth: "none" }}
								>
									<Bottom />
								</div>
							</div>
						);
					}}
				/>
			</div>
		</div>
	);
};

export default Home;
