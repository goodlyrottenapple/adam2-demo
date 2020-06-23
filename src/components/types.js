
import SharingMode from './builders/SharingMode';
import PermissionMode from './builders/PermissionMode';
import ProfileProperties from './builders/ProfileProperties';
import ProfileReferences from './builders/ProfileReferences';
import ResourceProperties from './builders/ResourceProperties';
import ResourceReferences from './builders/ResourceReferences';
import ResourceContacts from './builders/ResourceContacts';
import ResourceOrganisations from './builders/ResourceOrganisations';
import Term from './builders/Term';

export const typeMap = {
    'ProfileProperties': {
      type: ProfileProperties,
      label: 'Profile Basics',
      canHaveChildren: false
    },
    'ProfileReferences': {
      type: ProfileReferences,
      label: 'Profile References (+)',
      canHaveChildren: false
    },
    'ResourceProperties': {
    	type: ResourceProperties,
			label: 'Resource Properties',
			canHaveChildren: false
		},
    'ResourceReferences': {
      type: ResourceReferences,
      label: 'Resource References (+)',
      canHaveChildren: false
    },
    'ResourceContact': {
    	type: ResourceContacts,
			label: 'Resource Contacts (+)',
			canHaveChildren: false
    },
    'ResourceOrganisations': {
    	type: ResourceOrganisations,
			label: 'Resource Organisations (+)',
			canHaveChildren: false
    },
    'SharingMode': {
    	type: SharingMode,
			label: 'Sharing Mode',
			canHaveChildren: false
		},
    'PermissionMode': {
    	type: PermissionMode,
			label: 'Permission Mode',
			canHaveChildren: false
		},
		'Term': {
    	type: Term,
			label: 'Term (+)',
			canHaveChildren: true,
			childrenType: ['Term'],
			rootNesting: (e) => ({terms:[e]})
    }
  }
