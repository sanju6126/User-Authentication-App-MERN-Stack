import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';

async function connect() {
    const monogod = await MongoMemoryServer.create();
    const getUri = monogod.getUri();

    mongoose.set('strictQuery',true);
    const db = await mongoose.connect(getUri);
    console.log("Database connected");

    return db;

}

export default connect;