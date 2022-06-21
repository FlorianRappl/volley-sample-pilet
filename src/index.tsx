import './Styles/tile.scss';
import * as React from 'react';
import { Link } from 'react-router-dom';
import type { PiletApi } from 'sample-piral';

const UltimateVolley = React.lazy(() => import('./volley'));

export function setup(app: PiletApi) {
  const path = '/ultimate-volley';

  app.registerMenu?.(() => <Link to={path}>Ultimate Volley</Link>);

  app.registerTile?.(
    () => (
      <Link to={path} className="volley-tile">
        Ultimate Volley
      </Link>
    ),
    {
      initialColumns: 2,
      initialRows: 2,
    },
  );

  app.registerPage?.(path, UltimateVolley);
}
