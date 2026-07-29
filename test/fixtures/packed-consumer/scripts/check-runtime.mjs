import {
  CheckButton,
  Gallery,
  buildLayout,
  buildLayoutFlat,
} from '@picr/react-grid-gallery';

const exports = { CheckButton, Gallery, buildLayout, buildLayoutFlat };

for (const [name, value] of Object.entries(exports)) {
  if (typeof value !== 'function') {
    throw new TypeError(`Expected ${name} to be a function.`);
  }
}
