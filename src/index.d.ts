import { ComponentType } from "react";

export interface DRMTextOptions {
  text: string[];
  time?: string;
  color?: string;
  fontSize?: string;
  fontStyle?: string;
  fontName?: string;
  opacity?: string;
}

export interface Vis3MediaAPI {
  get: {
    ID: () => Promise<string>;
    CurrentTime: () => Promise<number>;
    Duration: () => Promise<number>;
    Title: () => Promise<string>;
  };
  actions: {
    Play: () => void;
    Pause: () => void;
    Seek: (time: number) => void;
    Rewind: () => void;
    Forward: (sec: number) => void;
  };
  events: {
    OnPlay: (cb: () => void) => void;
    OnPause: (cb: () => void) => void;
    OnEnded: (cb: () => void) => void;
    OnTimeupdate: (cb: (time: number) => void) => void;
  };
  DRMText: (options: DRMTextOptions) => void;
}

export interface Vis3Media {
  api: Vis3MediaAPI;
}

export interface Vis3Props {
  domainName: string;
  ID: string;
  onLoad?: (media: Vis3Media) => void;
}

export declare const Vis3: ComponentType<Vis3Props>;
export default Vis3;
