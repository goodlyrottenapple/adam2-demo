
import SharingMode from './builders/SharingMode';
import PermissionMode from './builders/PermissionMode';
import ProfileProperties from './builders/ProfileProperties';
import ProfileReferences from './builders/ProfileReferences';
import ResourceProperties from './builders/ResourceProperties';
import ResourceReferences from './builders/ResourceReferences';
import ResourceContacts from './builders/ResourceContacts';
import ResourceOrganisations from './builders/ResourceOrganisations';
import Term from './builders/Term';
import DUOTerms from './builders/DUOTerms';


export const typeMap = {
    'ProfileProperties': {
      type: ProfileProperties,
      label: 'Profile Basics',
      canHaveChildren: false,
      multipleInstances: false,
    },
    'ProfileReferences': {
      type: ProfileReferences,
      label: 'Profile References (add more)',
      canHaveChildren: false,
      multipleInstances: false,
    },
    'ResourceProperties': {
    	type: ResourceProperties,
			label: 'Resource Properties',
      canHaveChildren: false,
      multipleInstances: false,
		},
    'ResourceReferences': {
      type: ResourceReferences,
      label: 'Resource References (add more)',
      canHaveChildren: false,
      multipleInstances: true,
    },
    'ResourceContact': {
    	type: ResourceContacts,
			label: 'Resource Contacts (add more)',
      canHaveChildren: false,
      multipleInstances: true,
    },
    'ResourceOrganisations': {
    	type: ResourceOrganisations,
			label: 'Resource Organisations (add more)',
      canHaveChildren: false,
      multipleInstances: true,
    },
    'SharingMode': {
    	type: SharingMode,
			label: 'Sharing Mode',
      canHaveChildren: false,
      multipleInstances: false,
		},
    'PermissionMode': {
    	type: PermissionMode,
			label: 'Permission Mode',
      canHaveChildren: false,
      multipleInstances: false,
		},
		'Term': {
    	type: Term,
			label: 'Term (add more)',
			canHaveChildren: true,
			childrenType: ['Term'],
			rootNesting: (e) => ({terms:[e]})
    },
    'DUOTerms': {
    	type: DUOTerms,
			label: 'Terms from DUO',
      canHaveChildren: false,
      multipleInstances: false,
    }
  }
