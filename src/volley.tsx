import './Styles/volley.scss';
import * as React from 'react';
import { Application } from './Scripts/application';

let app: Application;

const UltimateVolleyGame: React.FC = () => {
  const root = React.useRef<HTMLDivElement>();

  React.useEffect(() => {
    if (!app) {
      app = new Application(root.current);
      app.run();
    } else {
      app.mount(root.current);
    }

    return () => app.unmount();
  });

  return (
    <div className="volley-game" ref={root}>
      <canvas width="1000" height="600" />
    </div>
  );
};

export default UltimateVolleyGame;
