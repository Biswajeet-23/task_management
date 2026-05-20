import {
    Injectable,
    NotFoundException,
    ForbiddenException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { Task, TaskDocument } from './tasks.schemas';

@Injectable()
export class TasksService {
    constructor(@InjectModel(Task.name) private taskModel: Model<TaskDocument>) { }

    // Create a new task
    async create(userId: string, dto: CreateTaskDto): Promise<TaskDocument> {
        const task = new this.taskModel({
            ...dto,
            userId: new Types.ObjectId(userId),
        });
        return task.save();
    }

    // Get all tasks for a user with optional filters
    async findAll(
        userId: string,
        filters: { status?: string; priority?: string; sortBy?: string },
    ): Promise<TaskDocument[]> {
        const query: Record<string, unknown> = {
            userId: new Types.ObjectId(userId),
        };

        if (filters.status) {
            query.status = filters.status;
        }
        if (filters.priority) {
            query.priority = filters.priority;
        }

        let sortOption: { dueDate?: 1 | -1; createdAt?: 1 | -1 } = {};
        if (filters.sortBy === 'dueDate') {
            sortOption = { dueDate: 1 };
        } else if (filters.sortBy === 'createdAt') {
            sortOption = { createdAt: -1 };
        } else {
            sortOption = { createdAt: -1 };
        }

        return this.taskModel.find(query).sort(sortOption).exec();
    }

    // Get single task (verify ownership)
    async findOne(userId: string, taskId: string): Promise<TaskDocument> {
        const task = await this.taskModel.findById(taskId).exec();
        if (!task) {
            throw new NotFoundException('Task not found');
        }
        if (task.userId.toString() !== userId) {
            throw new ForbiddenException(
                'You do not have permission to access this task',
            );
        }
        return task;
    }

    // Update task
    async update(
        userId: string,
        taskId: string,
        dto: UpdateTaskDto,
    ): Promise<TaskDocument> {
        // Verify ownership first
        await this.findOne(userId, taskId);

        const updated = await this.taskModel
            .findByIdAndUpdate(taskId, dto, { returnDocument: 'after' })
            .exec();

        if (!updated) {
            throw new NotFoundException('Task not found after update');
        }

        return updated;
    }

    // Delete task
    async delete(userId: string, taskId: string): Promise<void> {
        // Verify ownership first
        await this.findOne(userId, taskId);
        await this.taskModel.findByIdAndDelete(taskId).exec();
    }

    // Dashboard stats
    async getDashboard(userId: string) {
        const userObjectId = new Types.ObjectId(userId);
        const now = new Date();

        // Total tasks
        const total = await this.taskModel.countDocuments({ userId: userObjectId });

        // Tasks by status
        interface StatusAggResult {
            _id: string;
            count: number;
        }

        const statusAggregation = await this.taskModel.aggregate<StatusAggResult>([
            { $match: { userId: userObjectId } },
            { $group: { _id: '$status', count: { $sum: 1 } } },
        ]);

        const byStatus: Record<string, number> = {
            'To Do': 0,
            'In Progress': 0,
            Done: 0,
        };
        statusAggregation.forEach((item: StatusAggResult) => {
            byStatus[item._id] = item.count;
        });

        // Overdue tasks (dueDate < now and status != Done)
        const overdue = await this.taskModel.countDocuments({
            userId: userObjectId,
            dueDate: { $lt: now },
            status: { $ne: 'Done' },
        });

        return { total, byStatus, overdue };
    }
}
