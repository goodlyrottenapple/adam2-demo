
import SharingMode from './builders/SharingMode';
import ResourceProperties from './builders/ResourceProperties';
import Contact from './builders/Contact';
import Term from './builders/Term';


export const typeMap = {
    'ResourceProperties': { 
    	type: ResourceProperties,
			label: 'Resource properties',
			canHaveChildren: false
		},
    'Contact': { 
    	type: Contact,
			label: 'Contact',
			canHaveChildren: false
    },
    'SharingMode': { 
    	type: SharingMode,
			label: 'Sharing mode',
			canHaveChildren: false
		},
		'Term': { 
    	type: Term,
			label: 'Term',
			canHaveChildren: true,
			childrenType: ['Term'],
			rootNesting: (e) => ({terms:[e]})
    }
  }
