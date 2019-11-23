import React, { useRef, useEffect, useState } from 'react';
import dragula from 'dragula';

import './style.css';

const componentsList = [{
    name: 'text-field',
    label: 'Text Field'
}, {
    name: 'select',
    label: 'Select'
}, {
    name: 'container',
    label: 'Container',
    isContainer: true
}]

let drake;

const contains = (a, b) => a.contains ?
      a != b && a.contains(b) :
      !!(a.compareDocumentPosition(b) & 16);

const FormBuilder = () => {
    const [elements, setElements] = useState([])
    const [formSchema, setFormSchema] = useState([])
    const componentsListRef = useRef()
    const formContainerRef = useRef()
    const onDrop = (element, target, source, sibling) => {
        if (!target) {
            return;
        }
        if(element.dataset.container && element.classList.contains('drag-copy')) {
            const containerDropZone = document.createElement('div')
            containerDropZone.classList.add('container')
            element.appendChild(containerDropZone)
            drake.containers.push(containerDropZone)
        }
        element.classList.remove('drag-copy')
    };

    const onDrag = (...args) => console.log(args)
    
    const initDragula = containers => dragula(containers, {
        moves(el) {
          let moves = true;
          
          if (el.classList.contains('no-drag')) {
            moves = false;
          }
          return moves;
        },
        copy(el) {
          return el.classList.contains('drag-copy');
        },
        accepts(el, target) {
          return !el.contains(target) && !target.classList.contains('no-drop');
        }
      })
      .on('drop', (element, target, source, sibling) => onDrop(element, target, source, sibling))
      .on('drag', onDrag);

    useEffect(() => {
        const newElements = initDragula([componentsListRef.current, formContainerRef.current])
        drake = newElements
        window.magix = newElements
    }, [])
    return (
        <div>
            Form builder
            <div style={{ display: 'flex' }}>
                <div
                    style={{
                        background: 'tomato',
                        flexShrink: 0,
                        margin: 16,
                        minHeight: 600,
                        minWidth: 400,
                    }}
                    ref={componentsListRef}
                    id="components-container"
                    className="container no-drag no-drop"
                >
                    {componentsList.map(({ name, label, isContainer }) => (
                        <div data-container={isContainer} className="drag-copy" key={name}>{label}</div>
                    ))}
                </div>
                <div style={{
                    flexGrow: 1,
                    background: 'blue',
                    margin: 16,
                    color: 'white'
                }} className="form" ref={formContainerRef} id="form-container">
                </div>
            </div>
        </div>
    )
}

export default FormBuilder;
