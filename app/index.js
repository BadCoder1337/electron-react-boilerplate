import React from 'react';
import { render } from 'react-dom';
import Root from './components/Root';
import './app.global.css';

// const store = configureStore();

render(<Root />, document.getElementById('root'));

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
