export interface Club {
  id: string;
  name: string;
  description: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ClubFormValues {
  name: string;
  description: string;
}