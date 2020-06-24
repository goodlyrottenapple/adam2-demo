
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
      label: 'Profile References (add more)',
      canHaveChildren: false
    },
    'ResourceProperties': {
    	type: ResourceProperties,
			label: 'Resource Properties',
			canHaveChildren: false
		},
    'ResourceReferences': {
      type: ResourceReferences,
      label: 'Resource References (add more)',
      canHaveChildren: false
    },
    'ResourceContact': {
    	type: ResourceContacts,
			label: 'Resource Contacts (add more)',
			canHaveChildren: false
    },
    'ResourceOrganisations': {
    	type: ResourceOrganisations,
			label: 'Resource Organisations (add more)',
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
			label: 'Term (add more)',
			canHaveChildren: true,
			childrenType: ['Term'],
			rootNesting: (e) => ({terms:[e]})
    }
  }
