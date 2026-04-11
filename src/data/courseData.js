import { unit1 } from './unit1';
import { unit2 } from './unit2';

export const units = [unit1, unit2];

export function getUnit(id) {
  return units.find(u => u.id === Number(id));
}

export function getAllVocabulary() {
  return units.flatMap(u => u.vocabulary.map(v => ({ ...v, unitId: u.id, unitTitle: u.title })));
}