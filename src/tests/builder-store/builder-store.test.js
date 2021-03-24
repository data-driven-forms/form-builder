import builderStore from '../../builder-store/builder-store';

describe('builderStore', () => {
  it('creates store', () => {
    expect(builderStore).toEqual(
      expect.objectContaining({
        dispatch: expect.any(Function),
        getState: expect.any(Function),
        replaceReducer: expect.any(Function),
        subscribe: expect.any(Function),
      })
    );
    expect(builderStore.getState()).toEqual({ initialized: false });
  });
});
