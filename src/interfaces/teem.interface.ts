export interface TeamMember {
  id: string;
  name: string;
  role: Role;
  roleId: string;
  avatarUrl: string;
  facebookUrl: string;
  twitterUrl: string;
  instagramUrl: string;
  youtubeUrl: string;
  createdAt: string;
  updatedAt: string;
}

export interface Role {
  id: string;
  name: string;
}

export interface TeamMembersData {
  teamMembers: TeamMember[];
}
