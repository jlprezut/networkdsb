import React from 'react';
import { render } from 'react-dom';
import GraphiQL from 'graphiql';
import 'graphiql/graphiql.min.css';

const NODE_ENV = process.env.NODE_ENV ;
const DEBUG = process.env.DEBUG ;
const config = process.env.GRAPHIQL ;
const Logo = () => {
  return <span className="graphiql-container" style={{width:"15%"}}>
    <img width="30px" heigth="30px" src={config.logo}></img>
    <span className="">
      {config.projectName}
    </span>
  </span>;
}

// See GraphiQL Readme - Advanced Usage section for more examples like this
GraphiQL.Logo = Logo;

const App = () => (
  <GraphiQL
    style={{ height: '100vh' }}
    fetcher={async graphQLParams => {
      const data = await fetch(
        config.url,
        {
          method: 'POST',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(graphQLParams),
          credentials: 'same-origin',
        }
      );
      let res = await data.json().catch(() => data.text());
      if (res.error){
        return res;
      }
      return res.data ;
    }}
  />
);
render(<App />, document.getElementById('root'));
