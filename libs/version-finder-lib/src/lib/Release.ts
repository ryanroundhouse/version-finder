export class Release {
  id: number;
  version: string;
  supported: boolean;
  product: number;
  releases: number[] = [];
  releaseDate = '';

  constructor(
    id: number,
    product: number,
    version: string,
    supported: boolean,
    releases?: number[],
    releaseDate?: string
  ) {
    this.id = id;
    this.product = product;
    this.version = version;
    this.supported = supported;
    if (releases) {
      this.releases = releases;
    }
    if (releaseDate) {
      this.releaseDate = releaseDate;
    }
  }

  static compare(firstRelease: Release, secondRelease: Release): number {
    return secondRelease.version.localeCompare(firstRelease.version);
  }

  static isGreaterThan(firstRelease: Release, secondRelease: Release): boolean {
    return Release.compare(firstRelease, secondRelease) > 0;
  }
}

export default Release;
