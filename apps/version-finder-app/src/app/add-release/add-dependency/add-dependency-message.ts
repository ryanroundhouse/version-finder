export class AddDependencyMessage {
  releaseId: number;
  newReleaseId: number;

  constructor(releaseId: number, ReleaseId: number) {
    this.releaseId = releaseId;
    this.newReleaseId = ReleaseId;
  }
}
