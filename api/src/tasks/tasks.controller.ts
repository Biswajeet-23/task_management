import {
    Controller,
    Get,
    Post,
    Patch,
    Delete,
    Body,
    Param,
    Query,
    UseGuards,
    Request,
} from '@nestjs/common';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import {
    ApiBearerAuth,
    ApiOperation,
    ApiParam,
    ApiQuery,
    ApiResponse,
    ApiTags,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guards';

interface AuthenticatedRequest {
    user: {
        userId: string;
        email: string;
    };
}

@ApiTags('Tasks')
@ApiBearerAuth()
@Controller('tasks')
@UseGuards(JwtAuthGuard)
export class TasksController {
    constructor(private tasksService: TasksService) { }

    @Post()
    @ApiOperation({ summary: 'Create a new task' })
    @ApiResponse({ status: 201, description: 'Task created successfully' })
    @ApiResponse({ status: 400, description: 'Invalid input data' })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    create(@Body() dto: CreateTaskDto, @Request() req: AuthenticatedRequest) {
        return this.tasksService.create(req.user.userId, dto);
    }

    @Get()
    @ApiOperation({
        summary: 'Get all tasks with optional filtering and sorting',
    })
    @ApiQuery({
        name: 'status',
        required: false,
        enum: ['To Do', 'In Progress', 'Done'],
        description: 'Filter by status',
    })
    @ApiQuery({
        name: 'priority',
        required: false,
        enum: ['Low', 'Medium', 'High'],
        description: 'Filter by priority',
    })
    @ApiQuery({
        name: 'sortBy',
        required: false,
        example: 'dueDate',
        description: 'Sort field (e.g., dueDate, createdAt)',
    })
    @ApiResponse({ status: 200, description: 'Returns list of tasks' })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    findAll(
        @Query('status') status: string,
        @Query('priority') priority: string,
        @Query('sortBy') sortBy: string,
        @Request() req: AuthenticatedRequest,
    ) {
        return this.tasksService.findAll(req.user.userId, {
            status,
            priority,
            sortBy,
        });
    }

    @Get('dashboard')
    @ApiOperation({
        summary: 'Get dashboard summary (task counts by status, overdue count)',
    })
    @ApiResponse({ status: 200, description: 'Returns dashboard data' })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    getDashboard(@Request() req: AuthenticatedRequest) {
        return this.tasksService.getDashboard(req.user.userId);
    }

    @Get(':id')
    @ApiOperation({ summary: 'Get a single task by ID' })
    @ApiParam({
        name: 'id',
        example: '60d21b4667d0d8992e610c85',
        description: 'Task ID (MongoDB ObjectId)',
    })
    @ApiResponse({ status: 200, description: 'Returns task details' })
    @ApiResponse({ status: 404, description: 'Task not found' })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    findOne(@Param('id') id: string, @Request() req: AuthenticatedRequest) {
        return this.tasksService.findOne(req.user.userId, id);
    }

    @Patch(':id')
    @ApiOperation({ summary: 'Update an existing task' })
    @ApiParam({
        name: 'id',
        example: '60d21b4667d0d8992e610c85',
        description: 'Task ID (MongoDB ObjectId)',
    })
    @ApiResponse({ status: 200, description: 'Task updated successfully' })
    @ApiResponse({ status: 404, description: 'Task not found' })
    @ApiResponse({ status: 400, description: 'Invalid input data' })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    update(
        @Param('id') id: string,
        @Body() dto: UpdateTaskDto,
        @Request() req: AuthenticatedRequest,
    ) {
        return this.tasksService.update(req.user.userId, id, dto);
    }

    @Delete(':id')
    @ApiOperation({ summary: 'Delete a task' })
    @ApiParam({
        name: 'id',
        example: '60d21b4667d0d8992e610c85',
        description: 'Task ID (MongoDB ObjectId)',
    })
    @ApiResponse({ status: 200, description: 'Task deleted successfully' })
    @ApiResponse({ status: 404, description: 'Task not found' })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    delete(@Param('id') id: string, @Request() req: AuthenticatedRequest) {
        return this.tasksService.delete(req.user.userId, id);
    }
}
