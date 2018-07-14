import React from 'react';
import { render } from 'react-dom';
import App from './components/App';
import './app.global.css';

// const store = configureStore();

render(<App />, document.getElementById('root'));

// if (module.hot) {
//   module.hot.accept('./containers/Root', () => {
//     const NextRoot = require('./containers/Root'); // eslint-disable-line global-require
//     render(
//       <AppContainer>
//         <NextRoot store={store} history={history} />
//       </AppContainer>,
//       document.getElementById('root')
//     );
//   });
// }
