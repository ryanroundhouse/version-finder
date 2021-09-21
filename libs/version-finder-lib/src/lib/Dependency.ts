export class Dependency {
  id: number;
  version: string;
  supported: boolean;
  family: number;
  dependencies: number[] = [];
  releaseDate = '';

  constructor(
    id: number,
    family: number,
    version: string,
    supported: boolean,
    dependencies?: number[],
    releaseDate?: string
  ) {
    this.id = id;
    this.family = family;
    this.version = version;
    this.supported = supported;
    if (dependencies) {
      this.dependencies = dependencies;
    }
    if (releaseDate) {
      this.releaseDate = releaseDate;
    }
  }

  static compare(
    firstDependency: Dependency,
    secondDependency: Dependency
  ): number {
    return secondDependency.version.localeCompare(firstDependency.version);
  }

  static isGreaterThan(
    firstDependency: Dependency,
    secondDependency: Dependency
  ): boolean {
    return Dependency.compare(firstDependency, secondDependency) > 0;
  }
}

export default Dependency;
