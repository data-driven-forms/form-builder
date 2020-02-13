import React from 'react';
import { mount } from 'enzyme';

import ComponentsContext from '../../components-context';
import ValidatorProperty from '../../properties-editor/validator-property';

describe('<ValidatorProperty />', () => {
  const PropertyComponent = ({ onChange, onBlur, value, type }) => (
    <div>
      <input onChange={onChange} onBlur={onBlur} value={value} type={type} />
    </div>
  );
  const property = {
    component: 'some-property-component',
    propertyName: 'some-property-name',
    label: 'Some property label'
  };

  afterEach(() => {});

  it('should mount and render corrrect component from ComponentsContext', () => {
    const wrapper = mount(
      <ComponentsContext.Provider
        value={{
          propertiesMapper: {
            'some-property-component': PropertyComponent
          }
        }}
      >
        <ValidatorProperty property={property} onChange={jest.fn()} index={0} />
      </ComponentsContext.Provider>
    );
    expect(wrapper.find(PropertyComponent)).toHaveLength(1);
  });

  it('should generate isDisabled prop and pass it to mapped component', () => {
    const wrapper = mount(
      <ComponentsContext.Provider
        value={{
          propertiesMapper: {
            'some-property-component': PropertyComponent
          }
        }}
      >
        <ValidatorProperty
          property={{
            ...property,
            original: {
              isRequired: true
            },
            restriction: {
              lock: true,
              inputAttribute: 'isRequired',
              validatorAttribute: 'isRequired'
            }
          }}
          onChange={jest.fn()}
          index={0}
        />
      </ComponentsContext.Provider>
    );
    expect(wrapper.find(PropertyComponent).props().isDisabled).toEqual(true);
  });

  it('should reset property on blur if max value is out of bounds', () => {
    const onChange = jest.fn();
    const wrapper = mount(
      <ComponentsContext.Provider
        value={{
          propertiesMapper: {
            'some-property-component': PropertyComponent
          }
        }}
      >
        <ValidatorProperty
          value={55}
          property={{
            ...property,
            type: 'number',
            original: {
              isRequired: true,
              'max-value': 10
            },
            restriction: {
              lock: true,
              inputAttribute: 'max',
              validatorAttribute: 'max-value'
            }
          }}
          restricted
          onChange={onChange}
          index={0}
        />
      </ComponentsContext.Provider>
    );
    const input = wrapper.find('input');
    expect(input.props().value).toEqual(55);
    input.simulate('blur');
    wrapper.update();
    expect(onChange).toHaveBeenCalledWith({ 'some-property-name': 10 }, 'modify', 0);
  });

  it('should reset property on blur if min value is out of bounds', () => {
    const onChange = jest.fn();
    const wrapper = mount(
      <ComponentsContext.Provider
        value={{
          propertiesMapper: {
            'some-property-component': PropertyComponent
          }
        }}
      >
        <ValidatorProperty
          value={10}
          property={{
            ...property,
            type: 'number',
            original: {
              isRequired: true,
              'min-value': 55
            },
            restriction: {
              lock: true,
              inputAttribute: 'min',
              validatorAttribute: 'min-value'
            }
          }}
          restricted
          onChange={onChange}
          index={0}
        />
      </ComponentsContext.Provider>
    );
    const input = wrapper.find('input');
    expect(input.props().value).toEqual(10);
    input.simulate('blur');
    wrapper.update();
    expect(onChange).toHaveBeenCalledWith({ 'some-property-name': 55 }, 'modify', 0);
  });

  it('should not reset value on blur if there is no reset value', () => {
    const onChange = jest.fn();
    const wrapper = mount(
      <ComponentsContext.Provider
        value={{
          propertiesMapper: {
            'some-property-component': PropertyComponent
          }
        }}
      >
        <ValidatorProperty
          value={13}
          property={{
            ...property,
            type: 'number',
            original: {
              isRequired: true
            },
            restriction: {
              lock: true,
              inputAttribute: 'min',
              validatorAttribute: 'min-value'
            }
          }}
          restricted
          onChange={onChange}
          index={0}
        />
      </ComponentsContext.Provider>
    );
    const input = wrapper.find('input');
    expect(input.props().value).toEqual(13);
    input.simulate('blur');
    wrapper.update();
    expect(onChange).toHaveBeenCalledWith({ 'some-property-name': 13 }, 'modify', 0);
  });

  it('should not use default value on blur if value is 0', () => {
    const onChange = jest.fn();
    const wrapper = mount(
      <ComponentsContext.Provider
        value={{
          propertiesMapper: {
            'some-property-component': PropertyComponent
          }
        }}
      >
        <ValidatorProperty
          value={0}
          property={{
            ...property,
            type: 'number',
            original: {
              isRequired: true,
              'min-value': 55
            },
            restriction: {
              lock: true,
              inputAttribute: 'max',
              validatorAttribute: 'max-value'
            }
          }}
          restricted
          onChange={onChange}
          index={0}
        />
      </ComponentsContext.Provider>
    );
    const input = wrapper.find('input');
    expect(input.props().value).toEqual(0);
    input.simulate('blur');
    wrapper.update();
    expect(onChange).toHaveBeenCalledWith({ 'some-property-name': 0 }, 'modify', 0);
  });

  it('should call onChange callback', () => {
    const onChange = jest.fn();
    let wrapper = mount(
      <ComponentsContext.Provider
        value={{
          propertiesMapper: {
            'some-property-component': PropertyComponent
          }
        }}
      >
        <ValidatorProperty property={property} onChange={onChange} index={0} />
      </ComponentsContext.Provider>
    );
    wrapper.find('input').simulate('change', { target: { value: 'Yay' } });
    expect(onChange).toHaveBeenCalledWith(
      {
        'some-property-name': expect.objectContaining({
          target: expect.objectContaining({ value: 'Yay' })
        })
      },
      'modify',
      0
    );
  });
});
