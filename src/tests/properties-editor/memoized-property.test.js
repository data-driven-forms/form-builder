import React from 'react';
import configureStore from 'redux-mock-store';
import { Provider } from 'react-redux';
import { mount } from 'enzyme';

import MemoizedProperty from '../../properties-editor/memoized-property';

const Component = ({ onChange, value }) => <input onChange={onChange} value={value} />;

const ComponentWrapper = ({ store, ...props }) => (
  <Provider store={store}>
    <MemoizedProperty {...props} />
  </Provider>
);

describe('<MemoizedProperty />', () => {
  const mockStore = configureStore();
  const initialState = {
    fields: {
      'selected-field': {
        label: 'Label',
        restricted: false,
      },
    },
    selectedComponent: 'selected-field',
  };
  it('should mount and render correct component', () => {
    const store = mockStore(initialState);
    const wrapper = mount(
      <ComponentWrapper property={{ propertyName: 'label' }} store={store} Component={Component} handlePropertyChange={jest.fn()} />
    );
    expect(wrapper.find(Component)).toHaveLength(1);
  });

  it('should call handlePropertyChange', () => {
    const store = mockStore(initialState);
    const handlePropertyChange = jest.fn();
    const wrapper = mount(
      <ComponentWrapper property={{ propertyName: 'label' }} store={store} Component={Component} handlePropertyChange={handlePropertyChange} />
    );
    expect(wrapper.find(Component)).toHaveLength(1);
    wrapper.find('input').simulate('change', { target: { value: 'New label' } });
    expect(handlePropertyChange).toHaveBeenCalledWith(
      expect.objectContaining({
        target: expect.objectContaining({ value: 'New label' }),
      }),
      'label'
    );
  });

  it('should update if propertyValidation prop was changed', () => {
    let store = mockStore(initialState);
    const newState = {
      ...initialState,
      fields: {
        'selected-field': {
          label: 'Label',
          restricted: false,
          propertyValidation: { label: { message: 'Foo' } },
        },
      },
    };
    const wrapper = mount(
      <ComponentWrapper property={{ propertyName: 'label' }} store={store} Component={Component} handlePropertyChange={jest.fn()} />
    );
    expect(wrapper.find(Component).props().innerProps.propertyValidation).toEqual();
    wrapper.setProps({ store: mockStore(newState) });
    wrapper.update();
    expect(wrapper.find(Component).props().innerProps.propertyValidation).toEqual({
      message: 'Foo',
    });
  });
});
