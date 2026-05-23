import { unit1 } from './unit1';
import { unit2 } from './unit2';
import { unit3 } from './unit3';
import { unit4 } from './unit4';

export const units = [unit1, unit2, unit3, unit4];

export function getUnit(id) {
  return units.find(u => u.id === Number(id));
}

export function getAllVocabulary() {
  return units.flatMap(u => u.vocabulary.map(v => ({ ...v, unitId: u.id, unitTitle: u.title })));
}