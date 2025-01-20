interface Release {
  self: string;
  id: string;
  name: string;
  archived: boolean;
  released: boolean;
  projectId: number;
  description: string | null;
  startDate: string | null;
  releaseDate: string | null;
  userStartDate: string | null;
  userReleaseDate: string | null;
  overdue: boolean | null;
}
