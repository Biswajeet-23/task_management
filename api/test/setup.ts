import mongoose from 'mongoose';

export const setupTestDB = async (): Promise<void> => {
    await mongoose.connect('mongodb://localhost:27017/task_management_test');
};

export const clearCollections = async (): Promise<void> => {
    const collections = mongoose.connection.collections;

    for (const key of Object.keys(collections)) {
        await collections[key].deleteMany({});
    }
};

export const teardownTestDB = async (): Promise<void> => {
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
};
