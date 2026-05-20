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
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guards';

interface AuthenticatedRequest {
    user: {
        userId: string;
        email: string;
    };
}

@Controller('tasks')
@UseGuards(JwtAuthGuard)
export class TasksController {
    constructor(private tasksService: TasksService) { }

    @Post()
    create(@Body() dto: CreateTaskDto, @Request() req: AuthenticatedRequest) {
        return this.tasksService.create(req.user.userId, dto);
    }

    @Get()
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
    getDashboard(@Request() req: AuthenticatedRequest) {
        return this.tasksService.getDashboard(req.user.userId);
    }

    @Get(':id')
    findOne(@Param('id') id: string, @Request() req: AuthenticatedRequest) {
        return this.tasksService.findOne(req.user.userId, id);
    }

    @Patch(':id')
    update(
        @Param('id') id: string,
        @Body() dto: UpdateTaskDto,
        @Request() req: AuthenticatedRequest,
    ) {
        return this.tasksService.update(req.user.userId, id, dto);
    }

    @Delete(':id')
    delete(@Param('id') id: string, @Request() req: AuthenticatedRequest) {
        return this.tasksService.delete(req.user.userId, id);
    }
}
