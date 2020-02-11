import { createStore } from 'redux';

import builderReducer from './builder-reducer';

const builderStore = createStore(builderReducer, { initialized: false });

export default builderStore;
