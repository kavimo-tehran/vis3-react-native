import { ComponentType } from "react";

export interface Vis3Props {
  domainName: string;
  ID: string;
  onLoad?: (media: any) => void;
  onPlay?: (data?: any) => void;
  onPause?: (data?: any) => void;
  onEnded?: (data?: any) => void;
}

export declare const Vis3: ComponentType<Vis3Props>;
export default Vis3;
