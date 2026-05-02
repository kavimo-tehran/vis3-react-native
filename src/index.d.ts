import { ComponentType } from "react";

export interface Vis3Props {
  /** Your Kavimo stream domain (without https://) */
  domainName: string;
  /** The media ID of the video to play */
  ID: string;
  /** Called when the player reports the media is ready */
  onLoad?: (media: any) => void;
  /** Called when playback starts */
  onPlay?: (data?: any) => void;
  /** Called when playback pauses */
  onPause?: (data?: any) => void;
  /** Called when playback finishes */
  onEnded?: (data?: any) => void;
}

export declare const Vis3: ComponentType<Vis3Props>;
export default Vis3;