export class AddDependencyMessage {
  releaseId: number;
  newDependencyId: number;

  constructor(releaseId: number, dependencyId: number) {
    this.releaseId = releaseId;
    this.newDependencyId = dependencyId;
  }
}
