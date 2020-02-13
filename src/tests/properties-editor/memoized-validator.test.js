import React from 'react';
import configureStore from 'redux-mock-store';
import { Provider } from 'react-redux';
import { mount } from 'enzyme';

import ComponentsContext from '../../components-context';
import MemoizedValidator from '../../properties-editor/memozied-validator';

const ContextComponent = ({ onChange, value }) => <input onChange={onChange} value={value} />;

const ComponentWrapper = ({ store, ...props }) => (
  <Provider store={store}>
    <ComponentsContext.Provider
      value={{
        propertiesMapper: {
          component: ContextComponent
        }
      }}
    >
      <MemoizedValidator {...props} />
    </ComponentsContext.Provider>
  </Provider>
);

describe('<MemoizedValidator />', () => {
  const mockStore = configureStore();
  const initialState = {
    fields: {
      'selected-field': {}
    },
    selectedComponent: 'selected-field'
  };

  it('should mount MemoizedValidator and pick component from context', () => {
    const store = mockStore(initialState);
    const wrapper = mount(
      <ComponentWrapper
        store={store}
        validator={{
          'validate-me': 'Yay'
        }}
        property={{
          propertyName: 'validate-me',
          component: 'component',
          label: 'Validate me'
        }}
        handleValidatorChange={jest.fn()}
        index={0}
      />
    );
    expect(wrapper.find(ContextComponent)).toHaveLength(1);
  });

  it('should trigger render only if validator had changed', () => {
    const store = mockStore(initialState);
    const wrapper = mount(
      <ComponentWrapper
        store={store}
        validator={{
          'validate-me': 'Yay'
        }}
        property={{
          propertyName: 'validate-me',
          component: 'component',
          label: 'Validate me'
        }}
        handleValidatorChange={jest.fn()}
        index={0}
      />
    );
    expect(wrapper.find('input').props().value).toEqual('Yay');
    wrapper.setProps({ validator: { 'validate-me': 'Nay' } });
    expect(wrapper.find('input').props().value).toEqual('Nay');
  });
});
