import * as express from 'express';
import Routing from './Routing';

class App {
    public express
  
    constructor () {
      this.express = express()
      new Routing().setupRouting(this.express);
    }
  }
  
  export default new App().express