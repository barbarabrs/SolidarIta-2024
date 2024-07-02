'use strict';
import app from './app';
const port = process.env.PORT || '5001';

app.listen(port, () => {
  app.get('logger').info(`Listening to requests on port ${port}`);
});
