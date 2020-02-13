import React from 'react';
import configureStore from 'redux-mock-store';
import { Provider } from 'react-redux';
import { mount } from 'enzyme';
import { validatorTypes } from '@data-driven-forms/react-form-renderer';

import PropertiesEditor from '../../properties-editor';
import ComponentsContext from '../../components-context';
import { SET_SELECTED_COMPONENT, REMOVE_COMPONENT } from '../../builder-state/builder-reducer';

const AddValidatorComponent = ({ addValidator }) => (
  <button id="add-validator" onClick={() => addValidator(validatorTypes.MIN_LENGTH)}>
    Add MIN_LENGTH
  </button>
);

const PropertiesEditorWrapper = ({ propertiesChildren, validationChildren, addValidator, handleClose, handleDelete }) => (
  <div>
    <h1>Properties editor</h1>
    <button id="close-properties-editor" onClick={handleClose}>
      Close
    </button>
    <button id="delete-field" onClick={handleDelete}>
      Delete
    </button>
    <div>{propertiesChildren}</div>
    <AddValidatorComponent addValidator={addValidator} />
    <div>{validationChildren}</div>
  </div>
);

const PropertyGroup = ({ children, handleDelete }) => (
  <div>
    <h2>Property group</h2>
    <button onClick={handleDelete} className="delete-validator">
      Delete validator
    </button>
    <div>{children}</div>
  </div>
);

const TextField = ({ value, onChange, fieldId, type }) => (
  <input id={fieldId} name={fieldId} value={value} type={type} onChange={({ target: { value } }) => onChange(value)} />
);
const Switch = ({ value, onChange, fieldId, isDisabled }) => (
  <input disabled={isDisabled} id={fieldId} type="checkbox" onChange={({ target: { checked } }) => onChange(checked)} checked={value} />
);

const ComponentWrapper = ({ store, ...props }) => (
  <Provider store={store}>
    <ComponentsContext.Provider
      value={{
        componentProperties: {
          'text-field': {
            attributes: [
              {
                propertyName: 'label',
                component: 'input',
                label: 'Label'
              }
            ]
          }
        },
        componentMapper: {
          PropertiesEditor: PropertiesEditorWrapper,
          PropertyGroup
        },
        propertiesMapper: {
          input: TextField,
          switch: Switch
        },
        debug: true
      }}
    >
      <PropertiesEditor {...props} />
    </ComponentsContext.Provider>
  </Provider>
);

describe('<PropertiesEditor />', () => {
  const mockStore = configureStore();
  const initialState = {
    fields: {
      'selected-component': {
        id: 'selected-component-id',
        component: 'text-field',
        isRequired: true,
        validate: [{ type: 'required-validator' }]
      }
    },
    selectedComponent: 'selected-component'
  };
  it('should mount and render PropertiesEditor and PropertyGroup', () => {
    const store = mockStore(initialState);
    const wrapper = mount(<ComponentWrapper store={store} />);
    /**
     * reder whole wrapper
     */
    expect(wrapper.find(PropertiesEditor)).toHaveLength(1);
    /**
     * one required switch
     */
    expect(wrapper.find(Switch)).toHaveLength(1);
    expect(wrapper.find(Switch).props().value).toEqual(true);
    /**
     * render 3 fields, name, initialValue are mandatory and label and required-message are from attributes
     */
    expect(wrapper.find(TextField)).toHaveLength(4);
    expect(
      wrapper
        .find(TextField)
        .at(0)
        .props().fieldId
    ).toEqual('name');
    expect(
      wrapper
        .find(TextField)
        .at(1)
        .props().fieldId
    ).toEqual('initialValue');
    expect(
      wrapper
        .find(TextField)
        .at(2)
        .props().fieldId
    ).toEqual('label');
    expect(
      wrapper
        .find(TextField)
        .at(3)
        .props().fieldId
    ).toEqual('required-message');
  });

  it('should add new validator to a list', () => {
    const expectedActions = [
      {
        type: 'setFieldValidator',
        payload: {
          action: 'add',
          fieldId: 'selected-component-id',
          type: 'min-length-validator'
        }
      }
    ];
    const store = mockStore(initialState);
    const wrapper = mount(<ComponentWrapper store={store} />);
    wrapper.find('#add-validator').simulate('click');
    expect(store.getActions()).toEqual(expectedActions);
  });

  it('should turn off required validator and turn on', () => {
    const store = mockStore(initialState);
    const expectedActions = [
      {
        type: 'setFieldValidator',
        payload: {
          action: 'remove',
          fieldId: 'selected-component-id',
          index: 0,
          type: 'required-validator'
        }
      },
      {
        type: 'setFieldValidator',
        payload: {
          action: 'add',
          fieldId: 'selected-component-id',
          index: 0,
          type: 'required-validator'
        }
      }
    ];
    const wrapper = mount(<ComponentWrapper store={store} />);
    wrapper.find('#required-validator').simulate('change', { target: { checked: false } });
    wrapper.find('#required-validator').simulate('change', { target: { checked: true } });
    expect(store.getActions()).toEqual(expectedActions);
  });

  it('should prevent turning off required validator on restricted field', () => {
    const store = mockStore({
      ...initialState,
      fields: {
        'selected-component': {
          ...initialState.fields['selected-component'],
          restricted: true,
          validate: [{ type: 'required-validator', original: {} }]
        }
      }
    });
    const wrapper = mount(<ComponentWrapper store={store} />);
    expect(wrapper.find('input#required-validator').props().disabled).toEqual(true);
  });

  it('should modify required validator message', () => {
    const store = mockStore(initialState);
    const expectedActions = [
      {
        type: 'setFieldValidator',
        payload: {
          action: 'modify',
          fieldId: 'selected-component-id',
          index: 0,
          message: 'New required message'
        }
      }
    ];
    const wrapper = mount(<ComponentWrapper store={store} />);
    wrapper.find('#required-message').simulate('change', { target: { value: 'New required message' } });
    expect(store.getActions()).toEqual(expectedActions);
  });

  it('should change the label property', () => {
    const store = mockStore(initialState);
    const expectedActions = [
      {
        type: 'setFieldProperty',
        payload: {
          fieldId: 'selected-component-id',
          propertyName: 'label',
          value: 'New label'
        }
      }
    ];
    const wrapper = mount(<ComponentWrapper store={store} />);
    wrapper.find('#label').simulate('change', { target: { value: 'New label' } });
    expect(store.getActions()).toEqual(expectedActions);
  });

  it('should modify non required validator', () => {
    const store = mockStore({
      ...initialState,
      fields: {
        'selected-component': {
          ...initialState.fields['selected-component'],
          validate: [...initialState.fields['selected-component'].validate, { type: validatorTypes.MIN_LENGTH, threshold: 5 }]
        }
      }
    });
    const expectedActions = [
      {
        payload: {
          action: 'modify',
          fieldId: 'selected-component-id',
          index: 1,
          threshold: 10
        },
        type: 'setFieldValidator'
      },
      {
        payload: {
          action: 'modify',
          fieldId: 'selected-component-id',
          index: 1,
          message: 'Field must have atleast 10 characters'
        },
        type: 'setFieldValidator'
      }
    ];
    const wrapper = mount(<ComponentWrapper store={store} />);
    expect(wrapper.find('input[type="number"]#threshold-1')).toHaveLength(1);
    expect(wrapper.find('input#message-1')).toHaveLength(1);
    wrapper.find('input[type="number"]#threshold-1').simulate('change', { target: { value: '10' } });
    wrapper.find('input#message-1').simulate('change', {
      target: { value: 'Field must have atleast 10 characters' }
    });
    expect(store.getActions()).toEqual(expectedActions);
  });

  it('should delete non required validator', () => {
    const store = mockStore({
      ...initialState,
      fields: {
        'selected-component': {
          ...initialState.fields['selected-component'],
          validate: [...initialState.fields['selected-component'].validate, { type: validatorTypes.MIN_LENGTH, threshold: 5 }]
        }
      }
    });
    const expectedActions = [
      {
        payload: {
          action: 'remove',
          fieldId: 'selected-component-id',
          index: 1
        },
        type: 'setFieldValidator'
      }
    ];
    const wrapper = mount(<ComponentWrapper store={store} />);
    wrapper
      .find('button.delete-validator')
      .last()
      .simulate('click');
    expect(store.getActions()).toEqual(expectedActions);
  });

  it('should prevent deletion of restricted non required validator', () => {
    const store = mockStore({
      ...initialState,
      fields: {
        'selected-component': {
          ...initialState.fields['selected-component'],
          validate: [...initialState.fields['selected-component'].validate, { type: validatorTypes.MIN_LENGTH, threshold: 5, original: {} }]
        }
      }
    });
    const expectedActions = [];
    const wrapper = mount(<ComponentWrapper store={store} />);
    wrapper
      .find('button.delete-validator')
      .last()
      .simulate('click');
    expect(store.getActions()).toEqual(expectedActions);
  });

  it('should call the handle close action on properties editor', () => {
    const store = mockStore(initialState);
    const expectedActions = [
      {
        type: SET_SELECTED_COMPONENT
      }
    ];
    const wrapper = mount(<ComponentWrapper store={store} />);
    wrapper.find('button#close-properties-editor').simulate('click');
    expect(store.getActions()).toEqual(expectedActions);
  });

  it('should call the handle delete field action', () => {
    const store = mockStore(initialState);
    const expectedActions = [
      {
        type: REMOVE_COMPONENT,
        payload: 'selected-component-id'
      }
    ];
    const wrapper = mount(<ComponentWrapper store={store} />);
    wrapper.find('button#delete-field').simulate('click');
    expect(store.getActions()).toEqual(expectedActions);
  });

  it('should prevent call handle delete field action on restricted field', () => {
    const store = mockStore({
      ...initialState,
      fields: {
        'selected-component': {
          ...initialState.fields['selected-component'],
          restricted: true
        }
      }
    });
    const expectedActions = [];
    const wrapper = mount(<ComponentWrapper store={store} />);
    wrapper.find('button#delete-field').simulate('click');
    expect(store.getActions()).toEqual(expectedActions);
  });

  it('should set hasPropertyError if field has error', () => {
    const store = mockStore({
      ...initialState,
      fields: {
        'selected-component': {
          ...initialState.fields['selected-component'],
          propertyValidation: { prop: 'Error on prop' }
        }
      }
    });
    const wrapper = mount(<ComponentWrapper store={store} />);
    expect(wrapper.find(PropertiesEditorWrapper).props().hasPropertyError).toBeTruthy();
  });
});
