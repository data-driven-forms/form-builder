import React from 'react';
import { mount } from 'enzyme';

describe('i am happy test', () => {
  it('true === true', () => {
    expect(true).toEqual(true);
  });

  it('component test', () => {
    const CustomComponent = () => (
      <h1>
        Title <b>bold</b>
      </h1>
    );

    const wrapper = mount(<CustomComponent />);

    expect(wrapper.find('b')).toHaveLength(1);
  });
});
