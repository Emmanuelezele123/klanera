import mongoose, { ConnectOptions } from 'mongoose';
import { config } from 'dotenv';
import { Application } from 'express';

config();

const { MONGO_URI }: NodeJS.ProcessEnv = process.env;

const connectDB = (app:Application) => {
  const options: any = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  };
  mongoose
    .connect(MONGO_URI!, options)
    .then(() => {
      app.listen(process.env.PORT || 3000, () => {
        console.log('klanera APP is running on');
      });
    })
    .catch((err: Error) => {
      console.log(err.message);
      console.error(err);
    });
};

export default connectDB;