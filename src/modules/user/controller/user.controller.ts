import { Body, Controller, Param, Patch, Post } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { CreateUserDto, UpdateFavoriteCarParkDto } from '../dtos/user.dto';
import { UserService } from '../services/user.service';

@ApiTags('user')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @ApiOperation({
    operationId: 'userCreate',
    description: 'Create User',
  })
  @Post()
  register(@Body() data: CreateUserDto) {
    return this.userService.register(data);
  }

  @ApiOperation({
    operationId: 'updateUserById',
    description: 'Update user by id',
  })
  @Patch(':id')
  addCarParkToFavorite(
    @Param('id') id: number,
    @Body() data: UpdateFavoriteCarParkDto,
  ) {
    return this.userService.addCarParkToFavorite(id, data);
  }
}
