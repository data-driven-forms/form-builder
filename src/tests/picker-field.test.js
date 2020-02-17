import React from 'react';
import { mount } from 'enzyme';
import { DragDropContext, Droppable } from 'react-beautiful-dnd';
import ComponentsContext from '../components-context';
import PickerField from '../picker-field';

describe('PickerField', () => {
  let initialProps;
  let pokusPicker;
  let pokusComponent;

  beforeEach(() => {
    initialProps = {
      field: {
        id: 'draggable-id',
        component: 'pokus'
      },
      index: 0
    };

    pokusPicker = (props) => <button {...props}>drag me</button>;
    pokusComponent = (props) => <h1 {...props}>This is pokus</h1>;
  });

  it('renders picker component', () => {
    const wrapper = mount(
      <ComponentsContext.Provider
        value={{
          componentMapper: { pokus: pokusComponent },
          componentProperties: {},
          pickerMapper: { pokus: pokusPicker },
          propertiesMapper: {}
        }}
      >
        <DragDropContext onDragStart={() => console.log('draguji')} onDragEnd={jest.fn()}>
          <Droppable droppableId="droppable-id">
            {(provided) => (
              <div ref={provided.innerRef}>
                <PickerField {...initialProps} />
              </div>
            )}
          </Droppable>
        </DragDropContext>
      </ComponentsContext.Provider>
    );

    expect(wrapper.find(pokusPicker)).toHaveLength(1);
    expect(wrapper.find(pokusComponent)).toHaveLength(0);
  });
});
