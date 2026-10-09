import React from "react";
import { Composition } from "remotion";
import { Launch, TOTAL } from "./Launch";
import { LaunchV2, TOTAL as TOTAL_V2 } from "./LaunchV2";

export const Root: React.FC = () => (
  <>
    <Composition id="Launch" component={Launch} durationInFrames={TOTAL} fps={30} width={1920} height={1080} defaultProps={{ music: true }} />
    <Composition id="LaunchV2" component={LaunchV2} durationInFrames={TOTAL_V2} fps={30} width={1920} height={1080} defaultProps={{ music: true }} />
  </>
);
