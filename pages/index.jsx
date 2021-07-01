import * as React from 'react';
import Content from '../src/components/Content';
import { initialState, reducer } from '../src/reducer';
import { isMobile } from 'react-device-detect';

export default function Home() {
  const [state, dispatch] = React.useReducer(reducer, initialState);
  return (
    <>
      <Content isMobile={isMobile} dispatch={dispatch} state={state} />
    </>
  );
}
