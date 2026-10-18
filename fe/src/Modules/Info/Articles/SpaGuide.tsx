import { GuidePart } from "../GuidePart/GuidePart";
import { SPA_PART_TITLE } from "../guideOutline";
import { SpaHowSeenSection, SpaMetadataSection, SpaRoutingSection } from "./SpaRenderingRouting";
import { SpaPerformanceSection, SpaTestingSection } from "./SpaPerformanceTesting";

/**
 * The guide's part for sites built as single-page applications: the rest of the guide reads
 * as if every URL were a server-rendered document, and an SPA breaks that assumption at
 * every step — rendering, routing, status codes, metadata and the vitals.
 */
export function SpaGuide() {
	return (
		<GuidePart
			title={SPA_PART_TITLE}
			lead="The rest of this guide is written as if every URL were a finished HTML document from a server. In a single-page application it is not: the content, the links, the metadata and even the status code come out of JavaScript. Here is what search sees of that, and how to build an SPA that indexes like an ordinary site."
		>
			<SpaHowSeenSection />
			<SpaRoutingSection />
			<SpaMetadataSection />
			<SpaPerformanceSection />
			<SpaTestingSection />
		</GuidePart>
	);
}
