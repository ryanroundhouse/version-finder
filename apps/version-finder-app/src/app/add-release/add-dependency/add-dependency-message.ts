export class AddDependencyMessage {
  familyId: number;
  dependencyId: number;

  constructor(familyId: number, dependencyId: number) {
    this.familyId = familyId;
    this.dependencyId = dependencyId;
  }
}
