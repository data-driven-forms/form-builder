import React, { useContext, useState } from 'react';
import { DndContext, PointerSensor, useSensor, useSensors, closestCenter } from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';
import muiComponentMapper from '@data-driven-forms/mui-component-mapper/component-mapper';
import componentTypes from '@data-driven-forms/react-form-renderer/component-types';
import useFormApi from '@data-driven-forms/react-form-renderer/use-form-api';
import { AppBar, Tab, Tabs } from '@material-ui/core';
import { Add } from '@material-ui/icons';
import { Fragment } from 'react';
import { SortableContext, useSortable, arrayMove } from '@dnd-kit/sortable';

import BuilderContext from '../dnd-kit/builder-context';
import SortableContainer from '../dnd-kit/sortable-container';

const TabContent = ({ name, id, fields, formOptions, a11yProps }) => (
  <SortableContainer id={id}>
    <div style={{ minHeight: 50 }}>{fields?.length > 0 ? formOptions.renderForm(fields, formOptions) : <div>There will be drop zone</div>}</div>
  </SortableContainer>
);

const SortableTab = ({ name, title, internalId, ...props }) => {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: internalId });
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };
  return <Tab {...attributes} style={style} {...listeners} ref={setNodeRef} label={title} {...props} />;
};

const CustomTabs = (props) => {
  const [activeTab, setActiveTab] = useState(0);
  const formOptions = useFormApi();
  const { fields: builderFields, setContainerChildren, addSubcontainer, selectComponent, containers } = useContext(BuilderContext);
  const sensors = useSensors(useSensor(PointerSensor));

  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (active.id !== over.id) {
      setContainerChildren(props.name, (children) => {
        const oldIndex = children.indexOf(active.id);
        const newIndex = children.indexOf(over.id);
        return arrayMove(children, oldIndex, newIndex);
      });
    }
  };

  const { fields = [], name, AppBarProps, TabProps, TabsProps } = props;
  return (
    <div style={{ width: '100%' }} onClick={() => selectComponent(name)}>
      <AppBar position="static" {...AppBarProps}>
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <SortableContext items={fields}>
            <Tabs
              value={activeTab}
              onChange={(_e, tabIndex) => {
                setActiveTab(tabIndex);
              }}
              {...TabsProps}
            >
              {fields.map((field, index) => {
                const { title, name } = builderFields[field];
                return (
                  <SortableTab
                    onClick={(event) => {
                      event.preventDefault();
                      event.stopPropagation();
                      selectComponent(field);
                    }}
                    key={name}
                    name={name}
                    label={title}
                    internalId={field}
                    index={index}
                    {...TabProps}
                  />
                );
              })}
              <Tab
                key="add-tab"
                onClick={(event) => {
                  event.stopPropagation();
                  addSubcontainer(name);
                }}
                icon={<Add />}
              />
            </Tabs>
          </SortableContext>
        </DndContext>
      </AppBar>
      {fields.map((field, index) => {
        const data = builderFields[field];
        const { children } = containers[field];
        return (
          <div key={data.name} hidden={index !== activeTab}>
            <TabContent {...data} fields={children} name={data.name} formOptions={formOptions} />
          </div>
        );
      })}
    </div>
  );
};

const componentMapper = {
  ...muiComponentMapper,
  [componentTypes.TABS]: CustomTabs,
};

export default componentMapper;
