import { t } from '../core/localizer';
import { presetCollection } from './collection';


//
// `presetCategory` builds a `presetCollection` of member presets,
// decorated with some extra methods for searching and matching geometry
//
export function presetCategory(categoryID, category, all) {
  let _this = Object.assign({}, category);   // shallow copy
  let _searchName; // cache

  _this.id = categoryID;

  _this.members = presetCollection(
    category.members.map(presetID => all.item(presetID)).filter(Boolean)
  );

  _this.geometry = _this.members.collection
    .reduce((acc, preset) => {
      for (let i in preset.geometry) {
        const geometry = preset.geometry[i];
        if (acc.indexOf(geometry) === -1) {
          acc.push(geometry);
        }
      }
      return acc;
    }, []);

  _this.matchGeometry = (geom) => _this.geometry.indexOf(geom) >= 0;

  _this.matchAllGeometry = (geometries) => _this.members.collection
    .some(preset => preset.matchAllGeometry(geometries));

  _this.matchScore = () => -1;

  _this.name = () => t(`_tagging.presets.categories.${categoryID}.name`, { 'default': categoryID });
  _this.nameLabel = () => t.html(`_tagging.presets.categories.${categoryID}.name`, { 'default': categoryID });

  _this.terms = () => [];

  _this.searchName = () => {
    if (!_searchName) {
      _searchName = (_this.suggestion ? _this.originalName : _this.name()).toLowerCase();
      // split combined diacritical characters into their parts
      if (_searchName.normalize) _searchName = _searchName.normalize('NFD');
      // remove diacritics
      _searchName = _searchName.replace(/[\u0300-\u036f]/g, '');
    }
    return _searchName;
  };

  return _this;
}
