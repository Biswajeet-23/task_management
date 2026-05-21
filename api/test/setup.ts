import mongoose from 'mongoose';

const getMongoURI = (): string => {
    return (
        process.env.MONGODB_URI || 'mongodb://localhost:27017/task_management_test'
    );
};

export const setupTestDB = async (): Promise<void> => {
    const uri = getMongoURI();

    console.log(
        'Connecting to MongoDB:',
        uri.replace(/\/\/(.*?):(.*?)@/, '//$1:****@'),
    );

    await mongoose.connect(uri, {
        serverSelectionTimeoutMS: 10000,
        socketTimeoutMS: 45000,
    });

    console.log('MongoDB connected successfully');
};

export const clearCollections = async (): Promise<void> => {
    const collections = mongoose.connection.collections;

    for (const key of Object.keys(collections)) {
        const collection = collections[key];

        if (collection) {
            await collection.deleteMany({});
        }
    }
};

export const teardownTestDB = async (): Promise<void> => {
    if (
        mongoose.connection.readyState !== mongoose.ConnectionStates.disconnected
    ) {
        await mongoose.connection.dropDatabase();
        await mongoose.connection.close();
    }
};
