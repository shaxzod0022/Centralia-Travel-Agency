export interface Guides {
  name: string;
  avatarUrl: string;
  role: {
    name: string;
  };
  facebookUrl: string;
  twitterUrl: string;
  instagramUrl: string;
  youtubeUrl: string;
}

export interface GuidesData {
  teamMembersByRole: Guides[];
}
