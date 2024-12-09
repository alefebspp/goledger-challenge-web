export interface Asset {
  "@assetType": string;
  "@key": string;
  name: string;
  songs?: Array<{ "@key": string }>;
  albums?: Array<{ "@key": string }>;
  artist?: {
    "@key": string;
    "@assetType": string;
  };
}

export interface Artist extends Asset {
  country: string;
}

export interface Album extends Asset {
  artist: {
    "@key": string;
    "@assetType": string;
  };
  year: number;
}

export interface Song extends Asset {
  album: {
    "@key": string;
    "@assetType": string;
  };
}

export interface PlayList extends Asset {
  songs: {
    "@key": string;
    "@assetType": string;
  }[];
  private: boolean;
}
