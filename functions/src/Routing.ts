import * as express from 'express';

export default class Routing{

    private mainRouter = express.Router();

    public setupRouting(app){
        this.mainRouterSetup();
        app.use('/', this.mainRouter);
    }

    private mainRouterSetup(){
        this.mainRouter.get('/', (req, res) => {
            res.json({
              message: 'Hello World - App Routing 1!'
            })
          });
    }
}