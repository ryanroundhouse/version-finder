import { expect } from 'chai';
import { Dependency, Family } from '@version-finder/version-finder-lib';

import { VersionManager } from './VersionManager';

describe('version manager family tests', () => {
  it('add family adds a family', () => {
    const versionManager = new VersionManager([], []);
    const newFamily = new Family(0, '0th');
    const result = versionManager.addFamily(newFamily);

    expect(versionManager.families).has.same.members([newFamily]);
    expect(result).to.be.true;
  });
  it('get families gets families', () => {
    const newFamily = new Family(0, '0th');
    const versionManager = new VersionManager([newFamily], []);

    const addedFamilities = versionManager.getFamilies();
    expect(addedFamilities).has.same.members([newFamily]);
  });
  it('add family wont add duplicate family', () => {
    const newFamily = new Family(0, '0th');
    const versionManager = new VersionManager([newFamily], []);
    const result = versionManager.addFamily(newFamily);

    expect(versionManager.families).has.same.members([newFamily]);
    expect(result).to.be.false;
  });
  it('add family assigns a new id when no families present', () => {
    const newFamily = new Family(-1, '0th');
    const versionManager = new VersionManager([], []);
    const result = versionManager.addFamily(newFamily);

    expect(versionManager.families[0].id).does.not.equal(-1);
    expect(result).to.be.true;
  });
  it('add family assigns a new id when families are present', () => {
    const oldFamily = new Family(0, '0th');
    const newFamily = new Family(999, '1st');
    const versionManager = new VersionManager([oldFamily], []);
    const result = versionManager.addFamily(newFamily);

    expect(versionManager.families[0].id).does.not.equal(999);
    expect(versionManager.families[1].id).does.not.equal(999);
    expect(result).to.be.true;
  });
  it('version manager can rename a family', () => {
    const familyToBeRenamed = new Family(0, '0th');
    const newNamedFamily = new Family(0, '1st');
    const versionManager = new VersionManager([familyToBeRenamed], []);
    const result = versionManager.updateFamily(newNamedFamily);

    expect(versionManager.families[0].name).equals(newNamedFamily.name);
    expect(result).to.be.true;
  });
  it('version manager cant rename a family it doesnt hae', () => {
    const familyToBeRenamed = new Family(0, '0th');
    const versionManager = new VersionManager([], []);
    const result = versionManager.updateFamily(familyToBeRenamed);

    expect(result).to.be.false;
    expect(versionManager.families.length).equals(0);
  });
});
describe('version manager dependency tests', () => {
  it('get dependencies gets dependencies', () => {
    const newDependency = new Dependency(Math.random(), 0, '', true, []);
    const versionManager = new VersionManager([], [newDependency]);

    const dependencies = versionManager.getDependencies();
    expect(dependencies).has.same.members([newDependency]);
  });
  it('get dependencies by family gets only dependencies by family', () => {
    const family = new Family(0, '0th');
    const familyDependency = new Dependency(
      Math.random(),
      family.id,
      '',
      true,
      []
    );
    const nonFamilyDependency = new Dependency(Math.random(), 1, '', true, []);
    const versionManager = new VersionManager(
      [],
      [familyDependency, nonFamilyDependency]
    );

    const dependencies = versionManager.getDependenciesByFamily(family);
    expect(dependencies).has.same.members([familyDependency]);
  });
  it('add dependency adds a dependency', () => {
    const family = new Family(0, '0th');
    const dependency = new Dependency(Math.random(), family.id, '', true, []);
    const versionManager = new VersionManager([family], []);

    const result = versionManager.addDependency(dependency);
    expect(result).to.be.true;
    expect(versionManager.dependencies).has.same.members([dependency]);
  });
  it('add dependency fails when the family isnt present', () => {
    const dependency = new Dependency(Math.random(), 0, '', true, []);
    const versionManager = new VersionManager([], []);

    const result = versionManager.addDependency(dependency);
    expect(result).to.be.false;
    expect(versionManager.dependencies).has.same.members([]);
  });
  it('add dependency fails when the dependency already exists', () => {
    const family = new Family(0, '0th');
    const dependency = new Dependency(Math.random(), family.id, '', true, []);
    const versionManager = new VersionManager([family], [dependency]);

    const result = versionManager.addDependency(dependency);
    expect(result).to.be.false;
    expect(versionManager.dependencies).has.same.members([dependency]);
  });
  it('add dependency fails when the same version already exists for that dependency', () => {
    const family = new Family(0, '0th');
    const dependency = new Dependency(
      Math.random(),
      family.id,
      '1.0',
      true,
      []
    );
    const versionManager = new VersionManager([family], [dependency]);
    const duplicateDependency = new Dependency(
      Math.random(),
      family.id,
      '1.0',
      true,
      []
    );

    const result = versionManager.addDependency(duplicateDependency);
    expect(result).to.be.false;
    expect(versionManager.dependencies).has.same.members([dependency]);
  });
  it('add dependency cant depend on itself', () => {
    const family = new Family(0, '0th');
    const dependencyId = Math.random();
    const dependency = new Dependency(dependencyId, family.id, '1.0', true, [
      dependencyId,
    ]);
    const versionManager = new VersionManager([family], []);

    const result = versionManager.addDependency(dependency);
    expect(result).to.be.false;
    expect(versionManager.dependencies).has.same.members([]);
  });
  it('can delete release', () => {
    const family = new Family(0, '0th');
    const dependencyId = Math.random();
    const dependency = new Dependency(dependencyId, family.id, '1.0', true, [
      dependencyId,
    ]);
    const versionManager = new VersionManager([family], [dependency]);

    const result = versionManager.deleteDependency(dependency);
    expect(result).to.be.true;
    expect(versionManager.dependencies).has.same.members([]);
  });
  it('returns false if it cant find the release', () => {
    const family = new Family(0, '0th');
    const dependencyId = Math.random();
    const dependency = new Dependency(dependencyId, family.id, '1.0', true, [
      dependencyId,
    ]);
    const versionManager = new VersionManager([family], []);

    const result = versionManager.deleteDependency(dependency);
    expect(result).to.be.false;
    expect(versionManager.dependencies).has.same.members([]);
  });
});
