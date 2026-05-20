import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type TaskDocument = Task & Document;

@Schema({ timestamps: true })
export class Task {
    @Prop({ required: true, trim: true, maxlength: 200 })
    title!: string;

    @Prop({ trim: true, maxlength: 2000, default: '' })
    description!: string;

    @Prop({ enum: ['Low', 'Medium', 'High'], default: 'Medium' })
    priority!: string;

    @Prop({ enum: ['To Do', 'In Progress', 'Done'], default: 'To Do' })
    status!: string;

    @Prop({ type: Date })
    dueDate!: Date;

    @Prop({ type: Types.ObjectId, ref: 'User', required: true, index: true })
    userId!: Types.ObjectId;
}

export const TaskSchema = SchemaFactory.createForClass(Task);

// Compound indexes for faster queries
TaskSchema.index({ userId: 1, status: 1 });
TaskSchema.index({ userId: 1, priority: 1 });
TaskSchema.index({ userId: 1, dueDate: 1 });
TaskSchema.index({ userId: 1, createdAt: -1 });
