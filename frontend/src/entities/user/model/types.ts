export interface UserPublic {
  _id: string;
  email: string;
  displayName: string;
  tag: string;
  createdAt: string;
  updatedAt: string;
}

export interface UserByTag {
  _id: string;
  displayName: string;
  tag: string;
}
