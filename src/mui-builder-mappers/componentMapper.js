import React, { useContext, useState } from 'react';
import { DndContext, PointerSensor, useSensor, useSensors, closestCenter } from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';
import muiComponentMapper from '@data-driven-forms/mui-component-mapper/component-mapper';
import componentTypes from '@data-driven-forms/react-form-renderer/component-types';
import useFormApi from '@data-driven-forms/react-form-renderer/use-form-api';
import { AppBar, Tab, Tabs } from '@material-ui/core';
import { Add } from '@material-ui/icons';
import { Fragment } from 'react';
import BuilderContext from '../dnd-kit/builder-context';
import { SortableContext, useSortable, arrayMove } from '@dnd-kit/sortable';

const TabContent = ({ name, fields, formOptions }) => <Fragment key={name}>{formOptions.renderForm(fields, formOptions)}</Fragment>;

const SortableTab = ({ name, title, internalId, ...props }) => {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: internalId });
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };
  return (
    <span {...attributes} style={style} {...listeners} ref={setNodeRef}>
      <Tab key={name} label={title} {...props} />
    </span>
  );
};

const CustomTabs = (props) => {
  const [activeTab, setActiveTab] = useState(0);
  const formOptions = useFormApi();
  const { fields: builderFields, setContainerChildren } = useContext(BuilderContext);
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

  const { fields = [], AppBarProps, TabProps, TabsProps } = props;
  return (
    <div>
      <AppBar position="static" {...AppBarProps}>
        <Tabs value={activeTab} onChange={(_e, tabIndex) => setActiveTab(tabIndex)} {...TabsProps}>
          <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
            <SortableContext items={fields}>
              {fields.map((field) => {
                const { title, name } = builderFields[field];
                return <SortableTab key={name} name={name} label={title} internalId={field} {...TabProps} />;
              })}
              <Tab
                key="add-tab"
                label="Add tab"
                onClick={(event) => {
                  event.stopPropagation();
                }}
                icon={<Add />}
              />
            </SortableContext>
          </DndContext>
        </Tabs>
      </AppBar>
      {/* {fields.map((field, index) => {
        const data = builderFields[field];
        return (
          <div key={data.name} hidden={index !== activeTab}>
            <TabContent {...data} name={data.name} formOptions={formOptions} />
          </div>
        );
      })} */}
    </div>
  );
};

const componentMapper = {
  ...muiComponentMapper,
  [componentTypes.TABS]: CustomTabs,
};

export default componentMapper;
